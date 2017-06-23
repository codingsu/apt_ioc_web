# -*- coding:utf-8 -*-

import sys
from django.views.debug import technical_500_response
from django.conf import settings

#普通访问者看到的是友好的报错信息
# 管理员看到的是错误详情，以便于修复 BUG
# class UserBasedExceptionMiddleware(object):
#     def process_exception(self, request, exception):
#         if request.user.is_superuser or request.META.get('REMOTE_ADDR') in settings.INTERNAL_IPS:
#             return technical_500_response(request, *sys.exc_info())
from django.shortcuts import render

class loginMiddleware(object):
    def process_request(self, request):
        print '拦截'

        print request.POST.has_key('user')
        if request.session['user_id'] == '':
            if request.POST.has_key('user') and request.POST.has_key('password'):
                return None
            else:
                return render(request, 'login.html')
        else:
            return None