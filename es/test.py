# -*- coding:utf-8 -*-

from elasticsearch import Elasticsearch

es = Elasticsearch()
import MySQLdb
import traceback
import json
import re
import os
import config


def insertdatatoes(link, content):
    """
    将rss网页导入到es中
    :return:
    """

    db = MySQLdb.connect(config.dbip, config.dbusername, config.dbpassword, config.dbname, charset="utf8")
    cursor = db.cursor()

    sql = "select * from apt_rssmessage where link = '%s'" % (link)
    cursor.execute(sql)
    results = cursor.fetchall()
    for row in results:
        # print row
        try:
            doc = json.dumps({
                'rssname': row[1],
                'title': row[2],
                'author': row[3],
                'text': content,
                'link': row[5],
                'timestamp': row[4],
            })
        except:
            traceback.print_exc()
        print es.index(index="mytest", doc_type='rssmessage', id=row[0], body=doc)['created']
        print es.get(index="mytest", doc_type='rssmessage', id=row[0])


# insertdatatoes()

# match_phrase {"query": {"match_phrase":{key:text,'text':text}}}



def findfromes(word):
    words = word.split(' ')
    key = ['title','text','rssname','author']
    temp = []
    for i in range(2):
        bs = []
        for text in words:
            t = {
                'match':
                    {key[i]:
                        {
                            'query': text,
                            'operator': 'and',
                        }
                    }
            }
            bs.append(t)
        b = {
            'bool': {
                'should': bs
            }
        }
        temp.append(b)

    body = {
        'query':
            {
                'bool':
                    {
                        'should':
                            [temp]
                    }
            }
    }
    te = es.search(index="mytest", body=body, size=100)
    # print te
    links = []
    for i in te['hits']['hits']:
        # print i['_source']['link']
        links.append(i['_source']['link'])
    return links


def deletees(name):
    print es.indices.delete(index='mytest')


def getbody(originpath):
    filelist = os.listdir(originpath)
    for filename in filelist:
        # print filename
        path = os.path.join(originpath, filename)
        if os.path.isdir(path):
            getbody(path)
        elif path.endswith('html'):
            f = open(path)
            link = f.readline().replace('\n', '')
            print link
            content = f.read()
            # print content
            content = re.findall(r'<body.*</body>', content, re.S)
            # print content
            re_script = re.compile('<\s*script[^>]*>[^<]*<\s*/\s*script\s*>', re.I)  # Script
            content = re_script.sub("", content[0])
            # print '---------------------------------------'
            # print content
            re_comment = re.compile('<!--[^>]*-->')  # HTML注释
            content = re_comment.sub("", content)
            # print '---------------------------------------'
            # print content
            re_style = re.compile('<\s*style[^>]*>[^<]*<\s*/\s*style\s*>', re.I)  # style
            content = re_style.sub("", content)
            # print '---------------------------------------'
            # print content
            p = re.compile('<[^>]+>')
            content = p.sub("", content)
            # print '---------------------------------------'
            # print content

            re_longspace = re.compile('\s{2,}', re.I)
            content = re_longspace.sub(" ", content)
            # print '---------------------------------------'
            content = content.strip().replace('\n', '')
            # print '---------------------------------------'
            insertdatatoes(link, content)

def start():
    getbody(config.rootpath + '/rssspider/originhtml')


# getbody(r'../rssspider/originhtml')
# deletees('sdf')
# lists = findfromes('APT')
# print len(lists)
# for l in lists:
#     print l

