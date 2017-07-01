#-*- coding:utf-8 -*-

from hashlib import md5
from django.http import  JsonResponse
from django.shortcuts import render,redirect
from models import ioc
from models import iocTag
from models import rss
from models import keyfilter
from models import user
from models import rssmessage
from models import message_user
import time
import traceback
import logging

# Create your views here.
def login_decorator(func):
    """
    登陆修饰符,被该修饰符修饰的方法需要登陆后才可用
    """
    def wrappedFunc(request):
        if request.session.get("user_id", None):
            return func(request)
        else:
            # return redirect("/login?next=%s"%request.path)
            return index(request)
    return wrappedFunc

def index(request):
    """
    登录主页面
    :param request:
    :return:
    """
    return render(request,'login.html')

#登录判断逻辑
def login(request):
    """
    登录判断逻辑
    :param request:
    :return:
    """
    if request.method == 'POST': #当提交表单是post
        name = request.POST['user']
        pd = request.POST['password']
        users = user.objects.all()
        for u in users:
            if u.username == name:
                if u.password == md5(pd).hexdigest():
                    request.session['user_id'] = u.id
                    return board(request)
    return index(request)

def logout(request):
    """
    注销登录
    :param request:
    :return:
    """
    if request.method == 'GET':
        request.session['user_id'] = ''
        return index(request)

@login_decorator
def seachIoc(request):
    """
    IOC搜索
    :param request:
    :return:
    """
    allfind = []  # 找到的所有结果合集
    if request.method == 'POST':  # 当提交表单是post
        searchtext = request.POST['text']
        # print searchtext
        text = searchtext.split(' ')
        # print text
        for t in text:
            iocs = ioc.objects.filter(ioc_match__contains=t)
            for i in iocs:
                allfind.append(i)

        # print allfind
    return render(request, 'iocsearch.html', {'iocs': allfind})

@login_decorator
def about(request):
    """
    关于页面
    :param request:
    :return:
    """
    return render(request, 'about.html')
@login_decorator
def board(request):
    """
    主页面
    :param request:
    :return:
    """
    iocs = ioc.objects.all()
    # init data
    counts = 0
    taglist = iocTag.objects.all()
    campaigns = []
    types = []
    iocs = ioc.objects.all()
    # Generate iocTag Cloud


    dictcount = {}
    dictlist = []
    typecount = {}
    typelist = []
    # Generate Campaign Statistics Graph
    for object in campaigns:
        # c = Indicator.query.filter_by(campaign=object.campaign).count()
        c = 0
        if object.campaign == '':
            dictcount["category"] = "Unknown"
            tempx = (float(c) / float(counts)) * 100
            dictcount["value"] = round(tempx, 2)
        else:
            dictcount["category"] = object.campaign
            tempx = (float(c) / float(counts)) * 100
            dictcount["value"] = round(tempx, 2)

        dictlist.append(dictcount.copy())

    # Generate Indicator Type Graph
    for t in types:
        # c = Indicator.query.filter_by(type=t.type).count()
        c = 0
        typecount["category"] = t.type
        tempx = float(c) / float(counts)
        newtemp = tempx * 100
        typecount["value"] = round(newtemp, 2)
        typelist.append(typecount.copy())
    favs = []

    # Add Import from Cuckoo button to Dashboard page
    # settings = Setting.query.filter_by(_id=1).first()
    # settings = []
    # if 'on' in settings.cuckoo:
    #     importsetting = True
    # else:
    #     importsetting = False
    importsetting = False
    return render(request, 'dashboard.html', {'networks': dictlist, 'iocs': iocs, 'favs': favs, 'typelist': typelist,
                                              'taglist': taglist, 'importsetting': importsetting})

@login_decorator
def rsslist(request):
    """
    rss列表展示页面
    :param request:
    :return:
    """
    rsslist = rss.objects.all()
    return render(request, 'rsslist.html', {'rsslist':rsslist})

@login_decorator
def toeditrss(request):
    """
    编辑rss页面
    :param request:
    :return:
    """
    if request.method == 'GET':
        try:
            rssid = request.GET['id']
            erss = rss.objects.get(id=rssid)
            return render(request, 'editrss.html', {'erss': erss})
        except Exception,e:
            print traceback.format_exc()
            logging.error(traceback.format_exc())
    return errorhtml(request)

@login_decorator
def saverss(request):
    """
    保存rss页面
    :param request:
    :return:
    """
    if request.method == 'POST':
        rssid = request.POST['id']
        rsstitle = request.POST['text']
        rssothername = request.POST['othername']
        rssurl = request.POST['url']
        # print rsstitle
        try:
            editrss = rss.objects.get(id=rssid)
            editrss.othername = rssothername
            editrss.text = rsstitle
            editrss.url = rssurl
            editrss.type = 'rss'
            editrss.save()
        except Exception,e:
            editrss = rss.objects.create(othername=rssothername,text=rsstitle,type='rss',url=rssurl)
            editrss.save()
    return rsslist(request)

@login_decorator
def deleterss(request):
    """
    删除rss页面
    :param request:
    :return:
    """
    if request.method == 'GET':
        rssid = request.GET['id']
        try:
            erss = rss.objects.get(id=rssid)
            erss.delete()
            return rsslist(request)
        except Exception,e:
            print traceback.format_exc()
            logging.error(traceback.format_exc())
    return errorhtml(request)

@login_decorator
def tonewrss(request):
    """
    新建rss页面
    :param request:
    :return:
    """
    if request.method == 'GET':
        try:
            return render(request, 'editrss.html', {'erss': None})
        except Exception,e:
            print traceback.format_exc()
            logging.error(traceback.format_exc())
            return errorhtml(request)

@login_decorator
def keyfilters(request):
    """
    显示过滤标签页面
    :param request:
    :return:
    """
    ms = keyfilter.objects.all()
    return render(request, 'keyfilter.html', {'keyfilters':ms})

@login_decorator
def savekeyfilter(request):
    """
    保存过滤标签
    :param request:
    :return:
    """
    if request.method == 'POST':
        mid = request.POST['id']
        name = request.POST['name']
        keyword = request.POST['keyword']
        keycheck = request.POST['keycheck']
        try:
            m = keyfilter.objects.get(id=mid)
            m.name = name
            m.keyword = keyword
            m.keycheck = keycheck
            m.save()
        except Exception,e:
            print traceback.format_exc()
            m = keyfilter.objects.create(name=name,keyword=keyword,keycheck=keycheck)
            m.save()
    return keyfilters(request)

@login_decorator
def toeditkeyfilter(request):
    """
    保存过滤标签
    :param request:
    :return:
    """
    if request.method == 'GET':
        try:
            mid = request.GET['id']
            m = keyfilter.objects.get(id=mid)
            # print m.name
            return render(request, 'editkeyfilter.html', {'keyfilter': m})
        except Exception,e:
            print traceback.format_exc()
            logging.error(traceback.format_exc())
    return errorhtml(request)

@login_decorator
def tonewkeyfilter(request):
    """
    新建过滤标签
    :param request:
    :return:
    """
    if request.method == 'GET':
        try:
            return render(request, 'editkeyfilter.html', {'keyfilter': None})
        except Exception,e:
            print traceback.format_exc()
            logging.error(traceback.format_exc())
            return errorhtml(request)

@login_decorator
def deletekeyfilter(request):
    """
    删除过滤标签
    :param request:
    :return:
    """
    if request.method == 'GET':
        try:
            mid = request.GET['id']
            m = keyfilter.objects.get(id=mid)
            m.delete()
            return keyfilters(request)
        except Exception,e:
            print traceback.format_exc()
            logging.error(traceback.format_exc())
            return errorhtml(request)

@login_decorator
def usersetting(request):
    """
    用户设置
    :param request:
    :return:
    """
    uid = request.session['user_id']
    try:
        u = user.objects.get(id= uid)
        return render(request, 'edituser.html', {'user':u})
    except Exception,e:
        print traceback.format_exc()
        logging.error(traceback.format_exc())
        return errorhtml(request)

@login_decorator
def tosaveuser(request):
    """
    保存用户设置
    :param request:
    :return:
    """
    uid = request.session['user_id']
    if request.is_ajax():
        try:
            print request.GET
            myid = int(request.GET.get('id'))
            u1 = user.objects.get(id=myid)
            #不能修改别人的信息
            if myid != uid or user.objects.get(id=myid) == None:
                return errorhtml(request)
            else:
                u = user.objects.get(id=myid)
                username = request.GET.get('username')
                oldpwd = request.GET.get('oldpwd')
                newpwd = request.GET.get('newpwd')
                if u.password != md5(oldpwd).hexdigest():
                    print '密码错误'
                    return JsonResponse((0,'旧密码输入错误！'),safe=False)
                else:
                    u.password = md5(newpwd).hexdigest()
                    u.username = username
                    u.save()
                    return JsonResponse((1,'更改信息成功！'),safe=False)
        except Exception:
            print traceback.format_exc()
            logging.error(traceback.format_exc())
            return errorhtml(request)


@login_decorator
def news(request):
    """
    消息页面
    :param request:
    :return:
    """
    allioc = []
    allrss = []

    def checknew(rms,new_id):
        for i in rms:
            if i.id in new_id:
                return 1
            else:
                return -1
    try:
        if request.method == 'GET':
            rms = list(rssmessage.objects.all())
            keyfilters = keyfilter.objects.all()
            somem = []
            userid = request.session['user_id']
            new_id = list(message_user.objects.filter(user_id=userid).values('message_id'))
            new_ids = []
            for id in new_id:
                new_ids.append(id['message_id'])
            rms.sort(key=lambda obj:obj.date, reverse=True)
            rms.sort(key=lambda obj:obj.id in new_ids, reverse=False)
            for r in rms:
                for key in keyfilters:
                    keywordlist = key.keyword.split(' ')
                    for word in keywordlist:
                        if word in r.title.lower():
                            messages = {}
                            if r.id in new_ids:
                                messages['isread'] = True
                            else:
                                messages['isread'] = False
                            messages['id'] = r.id
                            messages['date'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(r.date)))
                            messages['title'] = r.title
                            messages['rssname'] = r.rssname
                            messages['link'] = r.link
                            messages['author'] = r.author
                            messages['tags'] = key.name
                            somem.append(messages)
                            break
                # if r.keycheck == 'rsstitle':
                #     pass
                # elif k.keycheck == 'iocmatch':
                #     iocs = ioc.objects.filter(ioc_match__contains=k.keyword).all()
                #     print len(iocs)
                #     for i in iocs:
                #         allioc.append(i)
            allm = []
            for r in rms:
                messages = {}
                if r.id in new_ids:
                    messages['isread'] = True
                else:
                    messages['isread'] = False
                messages['id'] = r.id
                messages['date'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(r.date)))
                messages['title'] = r.title
                messages['rssname'] = r.rssname
                messages['link'] = r.link
                messages['author'] = r.author
                messages['tags'] = "无"
                for key in keyfilters:
                    keywordlist = key.keyword.split(' ')
                    for word in keywordlist:
                        if word in r.title.lower():
                            messages['tags'] = key.name
                            break
                allm.append(messages)

        return render(request, 'newlist.html', {'messages':somem, 'allmessages':allm})
    except Exception , e:
        traceback.format_exc()
        logging.error(traceback.format_exc())
        return errorhtml(request)

@login_decorator
def readNew(request):
    """
    记录用户读取的消息
    :param request:
    :return:
    """
    try:
        if request.method == 'GET':
            newids = request.GET['id']
            print newids
            newids = str(newids).split('-')
            n = []
            for id in newids:
                new = rssmessage.objects.get(id=id)
                n.append(new)
            userid = request.session['user_id']
            u = user.objects.get(id=userid)
            for new in n:
                new_user = message_user.objects.create(user_id=u, message_id=new)
                new_user.save()
            return news(request)
    except Exception as e:
        print traceback.format_exc()
        logging.error(traceback.format_exc())
        return errorhtml(request)
@login_decorator
def errorhtml(request):
    """
    显示错误的页面
    :param request:
    :return:
    """
    return render(request, 'error.html')
