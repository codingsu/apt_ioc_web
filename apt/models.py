from django.db import models

# Create your models here.
class ioc(models.Model):
    name = models.CharField(max_length=100, default="")
    date = models.CharField(max_length=20, default="")
    ioc_type = models.CharField(max_length=10, default="")
    ioc_match = models.CharField(max_length=200, default="")
    ioc_page = models.CharField(max_length=10, default="")
    ioc_oriurl = models.CharField(max_length=500, default="")
    class Meta:
        unique_together = ('name', 'ioc_match',)

class iocTag(models.Model):
    name = models.CharField(max_length=20, default="")

class rss(models.Model):
    othername = models.CharField(max_length=100, default="")
    text = models.CharField(max_length=100, default="")
    type = models.CharField(max_length=10, default="")
    url = models.CharField(max_length=100, default="")

class keyfilter(models.Model):
    keyword = models.CharField(max_length=100, default="")
    name = models.CharField(max_length=100,default="")
    keycheck = models.CharField(max_length=50,default="")

class user(models.Model):
    username = models.CharField(max_length=50, default="")
    password = models.CharField(max_length=50, default="")

class rssmessage(models.Model):
    rssname = models.CharField(max_length=100, default="")
    title = models.CharField(max_length=300, default="")
    author = models.CharField(max_length=100, default="")
    date = models.CharField(max_length=20, default="")
    link = models.CharField(max_length=300, default="")


class message_user(models.Model):
    user_id = models.ForeignKey(user,null=False)
    message_id = models.ForeignKey(rssmessage,null=False)

