"""apt_ioc_web URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url

from apt import views as apt_views

urlpatterns = [
    url(r'^$', apt_views.board, name='home'),
    url(r'^login$', apt_views.login, name='login'),
    url(r'^about$', apt_views.about,name='about'),
    url(r'^searchioc',apt_views.seachIoc,name='searchioc'),
    url(r'^board',apt_views.board,name='board'),
    url(r'^rsslist',apt_views.rsslist,name='rsslist'),
    url(r'^toeditrss',apt_views.toeditrss, name='toeditrss'),
    url(r'^saverss',apt_views.saverss, name='saverss'),
    url(r'^deleterss',apt_views.deleterss, name='deleterss'),
    url(r'^tonewrss',apt_views.tonewrss,name='tonewrss'),
    url(r'^keyfilters', apt_views.keyfilters, name='keyfilters'),
    url(r'^savekeyfilter', apt_views.savekeyfilter, name='savekeyfilter'),
    url(r'^toeditkeyfilter', apt_views.toeditkeyfilter, name='toeditkeyfilter'),
    url(r'^tonewkeyfilter', apt_views.tonewkeyfilter, name='tonewkeyfilter'),
    url(r'^deletekeyfilter', apt_views.deletekeyfilter, name='deletekeyfilter'),
    url(r'^usersetting', apt_views.usersetting, name='usersetting'),
    url(r'^news', apt_views.news, name='news'),
    url(r'^logout', apt_views.logout, name='logout'),
    url(r'^readnew', apt_views.readNew, name='readnew'),
    url(r'^saveuser', apt_views.tosaveuser, name='saveuser'),
    url(r'^testpdf', apt_views.showpdf,name='showpdf'),
    url(r'^contextseacher', apt_views.contextseacher,name='contextseacher'),
    url(r'^deleteuser',apt_views.deleteuser, name='deleteuser'),
    url(r'^tonewuser', apt_views.tonewuser, name='tonewuser'),
    url(r'^editmesstag', apt_views.editmesstag, name='editmesstag'),
    url(r'^upload_pdffile', apt_views.upload_pdffile, name='upload_pdffile'),
]
