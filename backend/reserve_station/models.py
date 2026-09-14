from django.db import models

class Personal(models.Model):
    name = models.CharField(max_length=122)
    age = models.IntegerField()
    phone = models.CharField(max_length=15)
    file = models.IntegerField()
    address = models.TextField()
    date = models.DateField(auto_now_add=True)
