from django import forms
from info.models import Information, Project

class EditProfileForm(forms.ModelForm):
    class Meta:
        model = Information
        exclude = ('born_date', 'address', 'cv')

class CreateProjectForm(forms.ModelForm):
    # Cambia el widget para el campo 'description' a un campo de texto simple
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 4, 'cols': 50}))

    class Meta:
        model = Project
        exclude = ('Slug',)

