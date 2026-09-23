from django.db import models

class Personal(models.Model):

    STATUS_CHOICES = [
        ("cancelled", "کنسل شد"),
        ("consent", "وقت مشاوره داره"),
        ("pending", "در انتظار بیعانه"),
        ("done", "انجام شده"),
        ("report", "خبر میدم"),
        ("wasdone", "انجام داده"),
        ("notaswer", "جواب نداده"),
    ]

    ENTER_CHOICES = [
        ("new_enter", "ورودی جدید"),
        ("old_enter", "ورودی قدیم"),
        ("instagram", "اینستاگرام"),
        ("whatsapp", "ورودی واتساپ"),
        ("google", "گوگل"),
        ("introduce", "معرفی"),
        ("bale", "بله"),
        ("message", "پیامک"),
        ("lucky_wheel", "گردونه شانس"),
        ("rubika", "روبیکا"),
        ("nini_site", "نی نی سایت"),
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
    enter_choices = models.CharField(
            choices=ENTER_CHOICES,
            null=True,
            blank=True,
            max_length=20,
    )
    city = models.CharField(max_length=122, blank=True, null=True)
    explain = models.TextField()

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
    explain = models.TextField()

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

class CallCenter(models.Model):

    EMPLOYEE_CHOICES = [
        ("atefeh", "عاطفه"),
        ("haniye", "هانیه"),
    ]

    persons = models.ForeignKey(Personal,on_delete=models.CASCADE, related_name="employee")
    name = models.CharField(max_length=122)


    