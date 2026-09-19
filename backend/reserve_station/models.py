from django.db import models

class Personal(models.Model):
    name = models.CharField(max_length=122)
    age = models.IntegerField()
    phone = models.CharField(max_length=15)
    file = models.IntegerField()
    address = models.TextField()
    reserve_date = models.DateField()
    date = models.DateField(auto_now_add=True)
    services = models.TextField(blank=True)

    def __str__(self):
        return self.name


class PersonalPicture(models.Model):
    person = models.ForeignKey(
        Personal,
        on_delete=models.CASCADE,
        related_name="pictures"
    )
    img_before = models.ImageField(upload_to="pictures/before/", blank=True, null=True)
    img_after = models.ImageField(upload_to="pictures/after/", blank=True, null=True)

    def __str__(self):
        return f"{self.person.name} - تصاویر"