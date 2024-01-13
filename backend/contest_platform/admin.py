from django.contrib import admin
from .models import Contest, User, GradeCriterion, Address, Entry, Person

# Register your models here.

admin.site.register(Contest)
admin.site.register(User)
admin.site.register(GradeCriterion)
admin.site.register(Address)
admin.site.register(Entry)
admin.site.register(Person)
