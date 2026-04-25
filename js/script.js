var ROOM_RATE_BY_KEY={luxury:'250',business:'160',family:'190',budget:'75',beach:'300',standard:'95'};
var ROOM_LABEL_BY_RATE={'250':'Luxury Suite','160':'Business Room','190':'Family Room','75':'Budget Room','300':'Beach Resort Villa','95':'Standard Room'};

function getLocalizedText(key,fallback,params){
if(window.StayEaseI18n&&typeof window.StayEaseI18n.getText==='function'){
return window.StayEaseI18n.getText(key,fallback,params);
}
if(window.StayEaseI18n&&typeof window.StayEaseI18n.formatText==='function'&&params){
return window.StayEaseI18n.formatText(fallback,params);
}
return fallback;
}

function getLocalizedRoomLabel(rate){
if(window.StayEaseI18n&&typeof window.StayEaseI18n.getRoomLabel==='function'){
var localizedLabel=window.StayEaseI18n.getRoomLabel(String(rate));
if(localizedLabel){return localizedLabel;}
}
return ROOM_LABEL_BY_RATE[String(rate)]||'';
}

function formatCurrency(amount){return '$'+String(amount);}

function setNodeText(node,value){if(node){node.textContent=value;}}

function setStatusMessage(id,message,type){
var node=document.getElementById(id);
if(!node){return;}
node.className='status-message'+(type?' '+type:'');
setNodeText(node,message);
}

function normalizeText(value,maxLength){
var text=value?value.replace(/\s+/g,' ').trim():'';
return maxLength?text.slice(0,maxLength):text;
}

function isValidEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);}

function isValidName(value){return /^[\p{L}\p{M}\s.'-]{2,80}$/u.test(value);}

function getSelectedRoomOption(){
var room=document.getElementById('room');
if(!room){return null;}
return room.options[room.selectedIndex]||null;
}

function getSelectedRoomName(){
var option=getSelectedRoomOption();
if(!option){return '';}
if(ROOM_LABEL_BY_RATE[option.value]){return getLocalizedRoomLabel(option.value);}
return '';
}

function sanitizeNightCount(){
var nights=document.getElementById('nights');
var value=nights?parseInt(nights.value,10):1;
if(!value||value<1){value=1;}
if(value>30){value=30;}
if(nights){nights.value=String(value);}
return value;
}

function getMinimumArrivalDateString(){
var minimumDate=new Date();
minimumDate.setHours(0,0,0,0);
minimumDate.setDate(minimumDate.getDate()+1);
var month=String(minimumDate.getMonth()+1);
var day=String(minimumDate.getDate());
if(month.length<2){month='0'+month;}
if(day.length<2){day='0'+day;}
return String(minimumDate.getFullYear())+'-'+month+'-'+day;
}

function isAllowedRoomRate(value){
return !!ROOM_LABEL_BY_RATE[String(value)];
}

function updateReservationSummary(){
var option=getSelectedRoomOption();
if(!option){return;}
var nightlyRate=isAllowedRoomRate(option.value)?Number(option.value):0;
var nights=sanitizeNightCount();
var total=nightlyRate*nights;
setNodeText(document.getElementById('selectedRoom'),getSelectedRoomName());
setNodeText(document.getElementById('nightlyRate'),formatCurrency(nightlyRate));
setNodeText(document.getElementById('stayNights'),String(nights));
setNodeText(document.getElementById('total'),formatCurrency(total));
}

function validateReservationForm(){
var nameField=document.getElementById('name');
var emailField=document.getElementById('email');
var arrivalDateField=document.getElementById('arrivalDate');
var requestField=document.getElementById('request');
var normalizedName=normalizeText(nameField?nameField.value:'',80);
var normalizedEmail=normalizeText(emailField?emailField.value:'',120);
var normalizedRequest=normalizeText(requestField?requestField.value:'',500);
var minimumArrivalDate=getMinimumArrivalDateString();
var arrivalDate=arrivalDateField?arrivalDateField.value:'';
var option=getSelectedRoomOption();
if(nameField){nameField.value=normalizedName;}
if(emailField){emailField.value=normalizedEmail;}
if(requestField){requestField.value=normalizedRequest;}
if(!normalizedName||!isValidName(normalizedName)){return{field:nameField,message:getLocalizedText('messages.reservation.invalidName','Please enter a valid full name using 2 to 80 letters.')};}
if(!normalizedEmail||!isValidEmail(normalizedEmail)){return{field:emailField,message:getLocalizedText('messages.reservation.invalidEmail','Please enter a valid email address before calculating the total.')};}
if(!option||!isAllowedRoomRate(option.value)){return{field:document.getElementById('room'),message:getLocalizedText('messages.reservation.invalidRoom','Please choose a valid room option from the available list.')};}
if(!arrivalDate||arrivalDate<minimumArrivalDate){return{field:arrivalDateField,message:getLocalizedText('messages.reservation.invalidDate','Please choose a valid arrival date that is not earlier than tomorrow.')};}
sanitizeNightCount();
return{field:null,message:''};
}

function calculateTotal(){
var validationResult=validateReservationForm();
if(validationResult.message){
setStatusMessage('message',validationResult.message,'error');
if(validationResult.field){validationResult.field.focus();}
return;
}
updateReservationSummary();
var roomName=getSelectedRoomName();
var nights=sanitizeNightCount();
var totalNode=document.getElementById('total');
var totalText=totalNode?totalNode.textContent:formatCurrency(0);
setStatusMessage('message',getLocalizedText('messages.reservation.success','Your estimated total for {room} over {nights} night(s) is {total}.',{room:roomName,nights:String(nights),total:totalText}),'success');
}

function sendContactMessage(){
var nameField=document.getElementById('contactName');
var emailField=document.getElementById('contactEmail');
var subjectField=document.getElementById('contactSubject');
var messageField=document.getElementById('contactText');
var normalizedName=normalizeText(nameField?nameField.value:'',80);
var normalizedEmail=normalizeText(emailField?emailField.value:'',120);
var normalizedSubject=normalizeText(subjectField?subjectField.value:'',120);
var normalizedMessage=normalizeText(messageField?messageField.value:'',1000);
if(nameField){nameField.value=normalizedName;}
if(emailField){emailField.value=normalizedEmail;}
if(subjectField){subjectField.value=normalizedSubject;}
if(messageField){messageField.value=normalizedMessage;}
if(!normalizedName||!isValidName(normalizedName)){setStatusMessage('contactMessage',getLocalizedText('messages.contact.invalidName','Please enter a valid name using 2 to 80 letters.'),'error');if(nameField){nameField.focus();}return;}
if(!normalizedEmail||!isValidEmail(normalizedEmail)){setStatusMessage('contactMessage',getLocalizedText('messages.contact.invalidEmail','Please enter a valid email address.'),'error');if(emailField){emailField.focus();}return;}
if(!normalizedSubject||normalizedSubject.length<4){setStatusMessage('contactMessage',getLocalizedText('messages.contact.invalidSubject','Please provide a short subject so the team can classify your request.'),'error');if(subjectField){subjectField.focus();}return;}
if(!normalizedMessage||normalizedMessage.length<10){setStatusMessage('contactMessage',getLocalizedText('messages.contact.invalidMessage','Please enter a message with enough detail so the team can help you.'),'error');if(messageField){messageField.focus();}return;}
setStatusMessage('contactMessage',getLocalizedText('messages.contact.success','Thank you, {name}. Your message has been prepared safely and the StayEase team will contact you soon.',{name:normalizedName}),'success');
}

function applyReservationFromQuery(){
var room=document.getElementById('room');
if(!room){return;}
var params=new URLSearchParams(window.location.search);
var requestedPrice=params.get('price');
var requestedRoom=params.get('room');
var safePrice=requestedPrice&&/^\d{2,3}$/.test(requestedPrice)?requestedPrice:'';
var safeRoom=requestedRoom&&ROOM_RATE_BY_KEY[requestedRoom]?requestedRoom:'';
var targetValue=safePrice||(safeRoom?ROOM_RATE_BY_KEY[safeRoom]:'');
if(!targetValue){return;}
for(var i=0;i<room.options.length;i++){
if(room.options[i].value===targetValue){
room.selectedIndex=i;
break;
}
}
}

function setDefaultArrivalDate(){
var arrivalDate=document.getElementById('arrivalDate');
if(!arrivalDate){return;}
var minimumArrivalDate=getMinimumArrivalDateString();
arrivalDate.min=minimumArrivalDate;
if(!arrivalDate.value||arrivalDate.value<minimumArrivalDate){arrivalDate.value=minimumArrivalDate;}
}

function bindReservationEvents(){
var room=document.getElementById('room');
var nights=document.getElementById('nights');
var reservationButton=document.getElementById('calculateTotalButton');
var reservationForm=document.getElementById('bookingForm');
if(room){room.addEventListener('change',updateReservationSummary);}
if(nights){
nights.addEventListener('input',updateReservationSummary);
nights.addEventListener('change',updateReservationSummary);
}
if(reservationButton){reservationButton.addEventListener('click',calculateTotal);}
if(reservationForm){
reservationForm.addEventListener('submit',function(event){
event.preventDefault();
calculateTotal();
});
}
}

function bindContactEvents(){
var contactButton=document.getElementById('contactSendButton');
var contactForm=document.getElementById('contactForm');
if(contactButton){contactButton.addEventListener('click',sendContactMessage);}
if(contactForm){
contactForm.addEventListener('submit',function(event){
event.preventDefault();
sendContactMessage();
});
}
}

function initializeStayEaseSecurity(){
applyReservationFromQuery();
setDefaultArrivalDate();
bindReservationEvents();
bindContactEvents();
updateReservationSummary();
}

document.addEventListener('DOMContentLoaded',initializeStayEaseSecurity);
document.addEventListener('stayease:languagechange',function(){
updateReservationSummary();
});
