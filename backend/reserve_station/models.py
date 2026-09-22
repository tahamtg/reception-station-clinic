from django.db import models

class Personal(models.Model):

    STATUS_CHOICES = [
        ("cancelled", "کنسل شد"),
        ("consent", "وقت مشاوره داره"),
        ("pending", "جواب نداده"),
        ("done", "انجام شده"),
        ("report", "خبر میدم"),
        ("willpay", "بیعانه قراره بزنم"),
    ]

    name = models.CharField(max_length=122)
    age = models.IntegerField()
    phone = models.CharField(max_length=15)
    file = models.IntegerField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    reserve_date = models.DateField()
    date = models.DateField(auto_now_add=True, null=True)
    services = models.TextField(blank=True, null=True)
    price = models.IntegerField(blank=True, null=True)
    submit = models.BooleanField(default=False, blank=True, null=True)
    status = models.CharField(
        choices=STATUS_CHOICES,
        null=True,
        blank=True,
        max_length=20,
    )

    def __str__(self):
        return self.name

class SubmitPersonal(models.Model):

    name = models.CharField(max_length=122)
    age = models.IntegerField()
    phone = models.CharField(max_length=15)
    file = models.IntegerField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    reserve_date = models.DateField()
    date = models.DateField(auto_now_add=True, null=True)
    services = models.TextField(blank=True, null=True)
    price = models.IntegerField(blank=True, null=True)

class PersonalPicture(models.Model):
    
    person = models.ForeignKey(
        SubmitPersonal,
        on_delete=models.CASCADE,
        related_name="pictures"
    )

    img_before = models.ImageField(upload_to="before/", blank=True, null=True)
    img_after = models.ImageField(upload_to="after/", blank=True, null=True)

    def __str__(self):
        return f"{self.person.name} - تصاویر"

    