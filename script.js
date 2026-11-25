'use strict';
const classes = {
  'Gentle yoga': 'Slow movement and optional chair support for beginners.',
  'Vinyasa yoga': 'Breath-led flowing movement with adaptable variations.',
  'Restorative yoga': 'Supported poses for relaxation and rest.',
  'Private session': 'Individual guidance tailored to your goals.'
};
const rules = {
  name: e => e.value.trim().length < 2 ? 'Enter at least two characters for your name.' : '',
  email: e => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim()) ? 'Enter a valid email address.' : '',
  contact: e => !e.value ? 'Choose a contact method.' : '',
  phone: e => document.querySelector('#contact').value === 'phone' && e.value.replace(/\D/g,'').length < 7 ? 'Enter a phone number with at least seven digits.' : '',
  interest: e => !e.value ? 'Choose a class or event.' : '',
  experience: e => !e.value ? 'Choose your experience level.' : '',
  message: e => e.value.length > 1000 ? 'Keep your message under 1001 characters.' : ''
};
function readPreference() { try { return localStorage.getItem('riverbendPreference') || ''; } catch { return ''; } }
function savePreference(value) { try { localStorage.setItem('riverbendPreference',value); return true; } catch { return false; } }
function initFinder() {
  const select = document.querySelector('#preference'); if (!select) return;
  const result = document.querySelector('#recommendation'), status = document.querySelector('#saved');
  function update() { result.textContent = classes[select.value] || 'Choose a class to see its benefits.'; }
  const stored = readPreference(); if (Object.hasOwn(classes,stored)) { select.value=stored; update(); status.textContent='Restored saved preference: '+stored; }
  select.addEventListener('change',()=>{update();status.textContent='';});
  document.querySelector('#save-preference').addEventListener('click',()=>{status.textContent = !select.value ? 'Choose a class first.' : savePreference(select.value) ? 'Saved preference: '+select.value : 'Browser storage is unavailable.';});
}
function validateField(field) {
  const message = rules[field.id](field); const error = document.getElementById(field.id+'-error');
  error.textContent=message; field.setAttribute('aria-invalid',String(Boolean(message))); return !message;
}
function initForm() {
  const form=document.querySelector('form'); if (!form) return;
  form.noValidate=true;
  const fields=Object.keys(rules).map(id=>document.getElementById(id));
  fields.forEach(field=>{const error=document.createElement('span');error.id=field.id+'-error';error.className='field-error';error.setAttribute('aria-live','polite');field.after(error);field.setAttribute('aria-describedby',error.id);field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validateField(field);});});
  const status=document.createElement('p');status.id='form-status';status.setAttribute('role','status');form.append(status);
  const interest=document.getElementById('interest'), stored=readPreference();
  if(Object.hasOwn(classes,stored)){interest.value=stored;status.textContent='Your saved class preference was restored.';}
  form.addEventListener('submit',event=>{event.preventDefault();const invalid=fields.filter(field=>!validateField(field));if(invalid.length){status.textContent='Please correct the highlighted fields.';invalid[0].focus();}else{status.textContent='Your information is valid. This demonstration does not send a reservation.';}});
}
initFinder(); initForm();
