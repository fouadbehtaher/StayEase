(function(){
var STORAGE_KEY='stayease-language';
var SUPPORTED_LANGUAGES={en:true,ar:true};
var currentLanguage='en';

function pair(en,ar){return{en:en,ar:ar};}

var I18N={
messages:{
reservation:{
invalidName:pair('Please enter a valid full name using 2 to 80 letters.','يرجى إدخال الاسم الكامل بشكل صحيح من حرفين إلى 80 حرفًا.'),
invalidEmail:pair('Please enter a valid email address before calculating the total.','يرجى إدخال بريد إلكتروني صحيح قبل حساب الإجمالي.'),
invalidRoom:pair('Please choose a valid room option from the available list.','يرجى اختيار غرفة صحيحة من القائمة المتاحة.'),
invalidDate:pair('Please choose a valid arrival date that is not earlier than tomorrow.','يرجى اختيار تاريخ وصول صحيح لا يسبق يوم غد.'),
success:pair('Your estimated total for {room} over {nights} night(s) is {total}.','إجمالي الحجز التقديري لـ {room} لمدة {nights} ليلة هو {total}.')
},
contact:{
invalidName:pair('Please enter a valid name using 2 to 80 letters.','يرجى إدخال اسم صحيح من حرفين إلى 80 حرفًا.'),
invalidEmail:pair('Please enter a valid email address.','يرجى إدخال بريد إلكتروني صحيح.'),
invalidSubject:pair('Please provide a short subject so the team can classify your request.','يرجى كتابة عنوان قصير حتى يتمكن الفريق من تصنيف طلبك.'),
invalidMessage:pair('Please enter a message with enough detail so the team can help you.','يرجى كتابة رسالة تحتوي على تفاصيل كافية حتى يتمكن الفريق من مساعدتك.'),
success:pair('Thank you, {name}. Your message has been prepared safely and the StayEase team will contact you soon.','شكرًا لك يا {name}. تم تجهيز رسالتك بأمان وسيتواصل معك فريق StayEase قريبًا.')
}
},
rooms:{
labels:{
'250':pair('Luxury Suite','الجناح الفاخر'),
'160':pair('Business Room','غرفة الأعمال'),
'190':pair('Family Room','الغرفة العائلية'),
'75':pair('Budget Room','الغرفة الاقتصادية'),
'300':pair('Beach Resort Villa','فيلا المنتجع الشاطئي'),
'95':pair('Standard Room','الغرفة القياسية')
},
options:{
'250':pair('Luxury Suite - $250/night','الجناح الفاخر - $250 لليلة'),
'160':pair('Business Room - $160/night','غرفة الأعمال - $160 لليلة'),
'190':pair('Family Room - $190/night','الغرفة العائلية - $190 لليلة'),
'75':pair('Budget Room - $75/night','الغرفة الاقتصادية - $75 لليلة'),
'300':pair('Beach Resort Villa - $300/night','فيلا المنتجع الشاطئي - $300 لليلة'),
'95':pair('Standard Room - $95/night','الغرفة القياسية - $95 لليلة')
},
guests:[
pair('1 Guest','ضيف واحد'),
pair('2 Guests','ضيفان'),
pair('3 Guests','3 ضيوف'),
pair('4 Guests','4 ضيوف')
]
}
};

function pick(value){
if(value&&typeof value==='object'&&value.en!==undefined){return value[currentLanguage]||value.en;}
return value;
}

function getNestedValue(source,path){
var parts=path.split('.');
var current=source;
for(var i=0;i<parts.length;i++){
if(!current||current[parts[i]]===undefined){return null;}
current=current[parts[i]];
}
return current;
}

function formatText(template,params){
var output=template;
for(var key in params){
if(Object.prototype.hasOwnProperty.call(params,key)){
output=output.replace(new RegExp('\\{'+key+'\\}','g'),params[key]);
}
}
return output;
}

function getText(path,fallback,params){
var value=getNestedValue(I18N,path);
var resolved=value?pick(value):fallback;
if(params&&resolved){return formatText(resolved,params);}
return resolved||fallback||'';
}

function getRoomLabel(rate){
var label=I18N.rooms.labels[String(rate)];
return label?pick(label):'';
}

function setTextAll(selector,text){
var nodes=document.querySelectorAll(selector);
for(var i=0;i<nodes.length;i++){nodes[i].textContent=text;}
}

function setTextList(selector,texts){
var nodes=document.querySelectorAll(selector);
for(var i=0;i<nodes.length&&i<texts.length;i++){nodes[i].textContent=texts[i];}
}

function setAttrAll(selector,attribute,value){
var nodes=document.querySelectorAll(selector);
for(var i=0;i<nodes.length;i++){nodes[i].setAttribute(attribute,value);}
}

function setAttrList(selector,attribute,values){
var nodes=document.querySelectorAll(selector);
for(var i=0;i<nodes.length&&i<values.length;i++){nodes[i].setAttribute(attribute,values[i]);}
}

function setLeadingText(selector,text){
var nodes=document.querySelectorAll(selector);
for(var i=0;i<nodes.length;i++){
for(var j=0;j<nodes[i].childNodes.length;j++){
if(nodes[i].childNodes[j].nodeType===3){
nodes[i].childNodes[j].nodeValue=text;
break;
}
}
}
}

function setLeadingTextList(selector,texts){
var nodes=document.querySelectorAll(selector);
for(var i=0;i<nodes.length&&i<texts.length;i++){
for(var j=0;j<nodes[i].childNodes.length;j++){
if(nodes[i].childNodes[j].nodeType===3){
nodes[i].childNodes[j].nodeValue=texts[i];
break;
}
}
}
}

function setStrongParagraph(selector,strongText,restText){
var node=document.querySelector(selector);
if(!node){return;}
var strong=node.querySelector('strong');
if(strong){strong.textContent=strongText;}
for(var i=0;i<node.childNodes.length;i++){
if(node.childNodes[i].nodeType===3){
node.childNodes[i].nodeValue=' '+restText;
}
}
}

function createLanguageSwitcher(){
var nav=document.querySelector('.navbar');
if(!nav||nav.querySelector('.language-switcher')){return;}
var switcher=document.createElement('div');
switcher.className='language-switcher';
switcher.setAttribute('role','group');
switcher.setAttribute('aria-label','Language switcher');
var englishButton=document.createElement('button');
englishButton.type='button';
englishButton.className='language-button';
englishButton.setAttribute('data-language','en');
englishButton.textContent='EN';
englishButton.addEventListener('click',function(){setLanguage('en');});
var arabicButton=document.createElement('button');
arabicButton.type='button';
arabicButton.className='language-button';
arabicButton.setAttribute('data-language','ar');
arabicButton.textContent='AR';
arabicButton.addEventListener('click',function(){setLanguage('ar');});
switcher.appendChild(englishButton);
switcher.appendChild(arabicButton);
nav.appendChild(switcher);
}

function updateLanguageSwitcher(){
var buttons=document.querySelectorAll('.language-button');
for(var i=0;i<buttons.length;i++){
var isActive=buttons[i].getAttribute('data-language')===currentLanguage;
buttons[i].classList.toggle('active',isActive);
buttons[i].setAttribute('aria-pressed',isActive?'true':'false');
}
var switcher=document.querySelector('.language-switcher');
if(switcher){
switcher.setAttribute('aria-label',currentLanguage==='ar'?'مبدل اللغة':'Language switcher');
}
}

function translateCommon(){
document.documentElement.lang=currentLanguage;
document.documentElement.setAttribute('xml:lang',currentLanguage);
document.documentElement.dir=currentLanguage==='ar'?'rtl':'ltr';
setTextAll('.navbar a[href="index.html"]',pick(pair('Main Page','الرئيسية')));
setTextAll('.navbar a[href="categories.html"]',pick(pair('Hotel Categories','فئات الإقامة')));
setTextAll('.navbar a[href="rooms.html"]',pick(pair('Room Details','تفاصيل الغرف')));
setTextAll('.navbar a[href="reservation.html"]',pick(pair('Reservation','الحجز')));
setTextAll('.navbar a[href="vision-mission.html"]',pick(pair('Vision & Mission','الرؤية والرسالة')));
setTextAll('.navbar a[href="about-developer.html"]',pick(pair('About Developer','عن المطور')));
setTextAll('.navbar a[href="contact.html"]',pick(pair('Contact Us','اتصل بنا')));
setTextAll('footer p',pick(pair('StayEase Hotel Booking Website | Graduation Project','موقع StayEase لحجز الإقامة | مشروع التخرج')));
updateLanguageSwitcher();
}

function translateHomePage(){
document.title=pick(pair('StayEase Hotel Booking','StayEase لحجز الإقامة'));
setTextAll('.hero-copy .eyebrow',pick(pair('Smart stays for holidays, family trips, and business travel.','إقامات ذكية للعطلات والرحلات العائلية والسفر العملي.')));
setTextAll('.hero-copy h1',pick(pair('Book with confidence, comfort, and clear room choices.','احجز بثقة وراحة مع خيارات غرف واضحة.')));
setTextAll('.hero-copy .hero-lead',pick(pair('StayEase brings the essentials together in one place: hotel categories, realistic room prices, quick comparisons, and a smooth reservation path.','يجمع StayEase كل ما يحتاجه الزائر في مكان واحد: فئات إقامة واضحة، أسعار واقعية، مقارنة سريعة، ومسار حجز سلس.')));
setTextList('.hero-actions a',[pick(pair('Explore Rooms','استكشف الغرف')),pick(pair('Reserve Now','احجز الآن'))]);
setTextList('.hero-copy .hero-points span',[pick(pair('Realistic nightly prices','أسعار ليلية واقعية')),pick(pair('Family, business, and luxury options','خيارات عائلية وعملية وفاخرة')),pick(pair('Fast access to booking details','وصول سريع إلى تفاصيل الحجز'))]);
setTextList('.hero-stats .stat-card span',[pick(pair('room types ready to compare','أنواع غرف جاهزة للمقارنة')),pick(pair('main guest styles covered','أنماط إقامة رئيسية متوفرة')),pick(pair('simple booking flow from start to finish','رحلة حجز بسيطة من البداية للنهاية'))]);
setTextAll('.home-section:nth-of-type(1) .section-heading .section-label',pick(pair('Why StayEase','لماذا StayEase')));
setTextAll('.home-section:nth-of-type(1) .section-heading h2',pick(pair('A homepage that helps visitors decide quickly.','واجهة رئيسية تساعد الزائر على اتخاذ القرار بسرعة.')));
setTextAll('.home-section:nth-of-type(1) .section-heading > p:last-of-type',pick(pair('The new layout highlights the most important actions first, then supports them with room previews, travel benefits, and direct links to the booking journey.','التصميم الجديد يبرز أهم الخطوات أولًا، ثم يدعمها بعروض للغرف ومزايا السفر وروابط مباشرة إلى رحلة الحجز.')));
setTextList('.feature-card h3',[pick(pair('Luxury Escapes','إقامات فاخرة')),pick(pair('Business Ready','جاهزة للأعمال')),pick(pair('Family Friendly','مناسبة للعائلات'))]);
setTextList('.feature-card p',[pick(pair('Upscale rooms with premium views, refined comfort, and polished amenities for guests who want more than a basic stay.','غرف راقية بإطلالات مميزة وراحة عالية وتجهيزات أنيقة للباحثين عن إقامة أكثر تميزًا.')),pick(pair('Smart rooms and productivity-focused facilities for short work trips, meetings, and comfortable overnight business stays.','غرف عملية وتجهيزات تدعم الإنتاجية لرحلات العمل القصيرة والاجتماعات والإقامة المريحة.')),pick(pair('Welcoming spaces with flexible comfort, shared seating, and practical features that suit parents and children together.','مساحات مريحة بمرونة عالية ومقاعد مشتركة وتجهيزات عملية تناسب الآباء والأطفال معًا.'))]);
setTextList('.feature-card a',[pick(pair('See luxury options','شاهد الخيارات الفاخرة')),pick(pair('Browse categories','تصفح الفئات')),pick(pair('View family room','اعرض الغرفة العائلية'))]);
setTextAll('.home-section:nth-of-type(2) .section-heading .section-label',pick(pair('Featured Rooms','غرف مميزة')));
setTextAll('.home-section:nth-of-type(2) .section-heading h2',pick(pair('Popular stays guests can book right away.','إقامات شائعة يمكن للضيوف حجزها مباشرة.')));
setTextList('.spotlight-copy .mini-badge',[pick(pair('Best for premium comfort','الأفضل للراحة الفاخرة')),pick(pair('Best for small families','الأفضل للعائلات الصغيرة')),pick(pair('Best for resort stays','الأفضل لإقامات المنتجعات'))]);
setTextList('.spotlight-copy h3',[pick(pair('Luxury Suite','الجناح الفاخر')),pick(pair('Family Room','الغرفة العائلية')),pick(pair('Beach Resort Villa','فيلا المنتجع الشاطئي'))]);
setTextList('.spotlight-copy p:not(.mini-badge)',[pick(pair('King bed, sea view, private living area, breakfast included, and a more elevated hotel experience.','سرير كبير وإطلالة بحرية ومنطقة جلوس خاصة وفطور مشمول وتجربة إقامة أكثر رفاهية.')),pick(pair('Comfortable shared space with child-friendly amenities, breakfast included, and a warm home-style atmosphere.','مساحة مريحة مشتركة مع تجهيزات مناسبة للأطفال وفطور مشمول وأجواء منزلية دافئة.')),pick(pair('Ocean-facing retreat with private beach access, open terrace, and a more exclusive holiday setting.','إقامة بإطلالة بحرية مع وصول خاص إلى الشاطئ وتراس مفتوح وأجواء عطلات أكثر خصوصية.'))]);
setTextList('.spotlight-meta span',[pick(pair('$250 per night','$250 لليلة')),pick(pair('$190 per night','$190 لليلة')),pick(pair('$300 per night','$300 لليلة'))]);
setTextList('.spotlight-meta a',[pick(pair('Reserve','احجز')),pick(pair('Reserve','احجز')),pick(pair('Reserve','احجز'))]);
setTextAll('.home-section:nth-of-type(3) .section-heading .section-label',pick(pair('How It Works','كيف يعمل الموقع')));
setTextAll('.home-section:nth-of-type(3) .section-heading h2',pick(pair('Three steps from browsing to booking.','ثلاث خطوات من التصفح إلى الحجز.')));
setTextList('.step-card h3',[pick(pair('Choose a category','اختر الفئة المناسبة')),pick(pair('Compare room details','قارن تفاصيل الغرف')),pick(pair('Confirm your reservation','أكّد حجزك'))]);
setTextList('.step-card p',[pick(pair('Start with the style of stay that fits the trip: beach, business, family, or standard comfort.','ابدأ بنوع الإقامة المناسب لرحلتك: شاطئية أو عملية أو عائلية أو قياسية.')),pick(pair('Review room images, guest-friendly features, and pricing without needing to jump between pages.','راجع صور الغرف والمزايا والأسعار بسهولة دون الحاجة للتنقل المعقد بين الصفحات.')),pick(pair('Open the reservation page, select nights, and calculate the total cost immediately.','افتح صفحة الحجز وحدد عدد الليالي واحسب التكلفة الإجمالية فورًا.'))]);
setTextAll('.info-card:nth-of-type(1) .section-label',pick(pair('Vision & Mission','الرؤية والرسالة')));
setTextAll('.info-card:nth-of-type(1) h2',pick(pair('Built to keep hotel booking simple and trustworthy.','مصمم ليجعل حجز الإقامة بسيطًا وموثوقًا.')));
setStrongParagraph('.info-card:nth-of-type(1) p:nth-of-type(2)',pick(pair('Vision:','الرؤية:')),pick(pair('To become a clear and dependable online destination for finding the right stay with less effort.','أن نصبح وجهة رقمية واضحة وموثوقة تساعد المستخدم على إيجاد الإقامة المناسبة بسهولة أكبر.')));
setStrongParagraph('.info-card:nth-of-type(1) p:nth-of-type(3)',pick(pair('Mission:','الرسالة:')),pick(pair('To help guests compare room types, understand pricing, and complete reservations with confidence.','مساعدة الضيوف على مقارنة أنواع الغرف وفهم الأسعار وإتمام الحجز بثقة.')));
setTextAll('.info-card:nth-of-type(1) a',pick(pair('Read the full vision and mission','اقرأ الرؤية والرسالة كاملة')));
setTextAll('.quick-links-card .section-label',pick(pair('Quick Access','وصول سريع')));
setTextAll('.quick-links-card h2',pick(pair('Everything important is one click away.','كل ما يهمك على بُعد نقرة واحدة.')));
setTextList('.quick-links a',[pick(pair('Hotel Categories','فئات الإقامة')),pick(pair('Room Details','تفاصيل الغرف')),pick(pair('Reservation Page','صفحة الحجز')),pick(pair('Vision & Mission','الرؤية والرسالة')),pick(pair('About Developer','عن المطور')),pick(pair('Contact Us','اتصل بنا'))]);
setTextAll('.contact-note',pick(pair('Need direct help? Contact StayEase at info@stayease.example or call +02 01147794004.','هل تحتاج إلى مساعدة مباشرة؟ تواصل مع StayEase عبر info@stayease.example أو اتصل على +02 01147794004.')));
setTextAll('.cta-strip .section-label',pick(pair('Ready To Book','جاهز للحجز')));
setTextAll('.cta-strip h2',pick(pair('Find the stay that matches your trip and reserve it today.','اعثر على الإقامة المناسبة لرحلتك واحجزها اليوم.')));
setTextList('.cta-strip .cta-actions a',[pick(pair('Go to Reservation','انتقل إلى الحجز')),pick(pair('Contact Us','اتصل بنا'))]);
}

function translateCategoriesPage(){
document.title=pick(pair('Hotel Categories','فئات الإقامة'));
setTextAll('.categories-hero .eyebrow',pick(pair('Current stays and future launches.','الإقامات الحالية وإطلاقات المستقبل.')));
setTextAll('.categories-hero h1',pick(pair('Hotel Categories','فئات الإقامة')));
setTextAll('.categories-hero .page-lead',pick(pair('Explore the main hotel categories available now, then discover two new services we are preparing to introduce soon. The new beginning is planned in Egypt, with Airbnb-style homes and Student Camp experiences presented as upcoming expansions.','استكشف فئات الإقامة المتاحة الآن، ثم تعرّف على خدمتين جديدتين نجهز لتقديمهما قريبًا. البداية الجديدة مخطط لها في مصر من خلال منازل بنمط Airbnb وتجربة Student Camp.')));
setTextList('.categories-hero .hero-points span',[pick(pair('Available hotel categories','فئات متاحة الآن')),pick(pair('Coming soon in Egypt','قريبًا في مصر')),pick(pair('Two new service pages','صفحتان لخدمتين جديدتين'))]);
setTextAll('.categories-hero .hero-note-card .section-label',pick(pair('Launch Focus','تركيز الإطلاق')));
setTextAll('.categories-hero .hero-note-card h2',pick(pair('Next Launch in Egypt','الإطلاق القادم في مصر')));
setTextAll('.categories-hero .hero-note-lead',pick(pair('Airbnb Homes and Student Camp introduce the next expansion direction for StayEase in Egypt.','تمثل خدمتا Airbnb Homes وStudent Camp اتجاه التوسع القادم لـ StayEase في مصر.')));
setTextList('.categories-hero .hero-note-points span',[pick(pair('Airbnb-style homes','منازل بنمط Airbnb')),pick(pair('Student-focused stays','إقامات موجهة للطلاب')),pick(pair('Awareness before rollout','تعريف بالخدمة قبل الإطلاق'))]);
setTextAll('.categories-section .section-heading .section-label',pick(pair('Available Now','متاح الآن')));
setTextAll('.categories-section .section-heading h2',pick(pair('Current hotel categories guests can browse today.','فئات الإقامة الحالية التي يمكن للزوار تصفحها اليوم.')));
setTextAll('.categories-section .section-heading > p:last-of-type',pick(pair('Choose the type of stay that fits the trip, whether the goal is luxury, business travel, family comfort, or a relaxing beach experience.','اختر نوع الإقامة الذي يناسب الرحلة سواء كان الهدف هو الفخامة أو السفر العملي أو راحة العائلة أو الاسترخاء على الشاطئ.')));
setTextList('.live-category-grid .category h2',[pick(pair('Luxury Hotels','فنادق فاخرة')),pick(pair('Business Hotels','فنادق الأعمال')),pick(pair('Family Hotels','فنادق عائلية')),pick(pair('Budget Hotels','فنادق اقتصادية')),pick(pair('Beach Resorts','منتجعات شاطئية'))]);
setTextList('.live-category-grid .category p',[pick(pair('Elegant suites, refined interiors, and premium guest comfort.','أجنحة أنيقة وتصميمات راقية وراحة عالية للضيف.')),pick(pair('Meeting-ready spaces, fast connectivity, and practical work facilities.','مساحات جاهزة للاجتماعات واتصال سريع ومرافق عملية للعمل.')),pick(pair('Comfortable stays designed for parents, children, and shared convenience.','إقامات مريحة مصممة للآباء والأطفال والراحة المشتركة.')),pick(pair('Affordable room options with clean design and essential amenities.','خيارات غرف بأسعار مناسبة مع تصميم نظيف وتجهيزات أساسية.')),pick(pair('Relaxing stays with sea views, open-air comfort, and holiday atmosphere.','إقامات مريحة بإطلالات بحرية وراحة مفتوحة وأجواء عطلات.'))]);
setTextAll('.coming-soon-section .section-heading .section-label',pick(pair('Coming Soon in Egypt','قريبًا في مصر')));
setTextAll('.coming-soon-section .section-heading h2',pick(pair('Two new services we are introducing as the next beginning in Egypt.','خدمتان جديدتان نقدم لهما كبداية قادمة في مصر.')));
setTextAll('.coming-soon-section .section-heading > p:last-of-type',pick(pair('These upcoming pages are here to explain the direction of the new launch and give visitors a preview of what StayEase plans to offer beyond traditional hotel categories.','هذه الصفحات القادمة موجودة لشرح اتجاه الإطلاق الجديد ومنح الزائر نظرة مسبقة على ما يخطط StayEase لتقديمه خارج نطاق الفئات التقليدية.')));
setTextList('.future-card .launch-badge',[pick(pair('Coming Soon in Egypt','قريبًا في مصر')),pick(pair('Coming Soon in Egypt','قريبًا في مصر'))]);
setTextList('.future-card h3',[pick(pair('Airbnb Homes','منازل Airbnb')),pick(pair('Student Camp','المعسكر الطلابي'))]);
setTextList('.future-card p:not(.launch-badge)',[pick(pair('Private apartments and home-style short stays for guests who want local comfort, extra space, and flexible living options.','شقق خاصة وإقامات قصيرة بطابع منزلي للباحثين عن الراحة المحلية والمساحة الإضافية ومرونة المعيشة.')),pick(pair('A youth-focused stay and activity concept designed for student groups, shared experiences, affordable accommodation, and community-based programs.','مفهوم إقامة وأنشطة موجه للشباب مصمم للمجموعات الطلابية والتجارب المشتركة والإقامة الاقتصادية والبرامج المجتمعية.'))]);
setTextList('.future-link',[pick(pair('Open service page','افتح صفحة الخدمة')),pick(pair('Open service page','افتح صفحة الخدمة'))]);
setTextAll('.categories-cta .section-label',pick(pair('Next Step','الخطوة التالية')));
setTextAll('.categories-cta h2',pick(pair('Browse the current rooms now or learn more about the upcoming Airbnb Homes and Student Camp pages.','تصفح الغرف الحالية الآن أو تعرّف أكثر على صفحتي Airbnb Homes وStudent Camp القادمتين.')));
setTextList('.categories-cta .cta-actions a',[pick(pair('View Current Rooms','اعرض الغرف الحالية')),pick(pair('Ask About Launch Dates','اسأل عن مواعيد الإطلاق'))]);
}

function translateRoomsPage(){
document.title=pick(pair('Room Details','تفاصيل الغرف'));
setTextAll('main h1',pick(pair('Room Details','تفاصيل الغرف')));
setTextAll('.intro',pick(pair('Each room includes an image, description, features, and price per night.','كل غرفة تتضمن صورة ووصفًا ومزايا وسعرًا لليلة الواحدة.')));
setTextList('.room h2',[pick(pair('Luxury Suite','الجناح الفاخر')),pick(pair('Business Room','غرفة الأعمال')),pick(pair('Family Room','الغرفة العائلية')),pick(pair('Budget Room','الغرفة الاقتصادية')),pick(pair('Beach Resort Villa','فيلا المنتجع الشاطئي')),pick(pair('Standard Room','الغرفة القياسية'))]);
setTextList('.room div > p:not(.price)',[pick(pair('King bed, sea view, living area, free WiFi, breakfast included.','سرير كبير وإطلالة بحرية ومنطقة معيشة وواي فاي مجاني وفطور مشمول.')),pick(pair('Desk, fast WiFi, meeting facilities, coffee machine.','مكتب وواي فاي سريع ومرافق اجتماعات وماكينة قهوة.')),pick(pair('Two beds, family seating area, child-friendly amenities, breakfast included.','سريران ومنطقة جلوس عائلية وتجهيزات مناسبة للأطفال وفطور مشمول.')),pick(pair('Clean room, double bed, private bathroom, WiFi.','غرفة نظيفة وسرير مزدوج وحمام خاص وواي فاي.')),pick(pair('Private beach access, ocean view, terrace, breakfast included.','وصول خاص إلى الشاطئ وإطلالة بحرية وتراس وفطور مشمول.')),pick(pair('Queen bed, city view, WiFi, TV.','سرير كوين وإطلالة على المدينة وواي فاي وتلفاز.'))]);
setTextList('.price',[pick(pair('$250 per night','$250 لليلة')),pick(pair('$160 per night','$160 لليلة')),pick(pair('$190 per night','$190 لليلة')),pick(pair('$75 per night','$75 لليلة')),pick(pair('$300 per night','$300 لليلة')),pick(pair('$95 per night','$95 لليلة'))]);
setTextAll('.room .btn',pick(pair('Reserve this room','احجز هذه الغرفة')));
}

function translateReservationPage(){
document.title=pick(pair('Reservation','الحجز'));
setTextAll('.reservation-hero .eyebrow',pick(pair('Fast booking, clear pricing, and a smoother reservation flow.','حجز سريع وأسعار واضحة وتجربة حجز أكثر سلاسة.')));
setTextAll('.reservation-hero h1',pick(pair('Reservation Page','صفحة الحجز')));
setTextAll('.reservation-hero .page-lead',pick(pair('Select the room that fits your stay, choose the number of nights, and get an instant total before final confirmation. The page is designed to keep every booking detail clear and easy to review.','اختر الغرفة المناسبة لإقامتك وحدد عدد الليالي واحصل على الإجمالي فورًا قبل التأكيد النهائي. الصفحة مصممة لتبقي كل تفاصيل الحجز واضحة وسهلة المراجعة.')));
setTextList('.reservation-hero .hero-points span',[pick(pair('Instant price calculation','حساب فوري للسعر')),pick(pair('Clear room comparison','مقارنة واضحة بين الغرف')),pick(pair('Simple reservation flow','خطوات حجز بسيطة'))]);
setTextAll('.reservation-hero .hero-note-card .section-label',pick(pair('Booking Note','ملاحظة الحجز')));
setTextAll('.reservation-hero .hero-note-card h2',pick(pair('Prices stay visible from selection to checkout.','الأسعار تبقى واضحة من الاختيار حتى إتمام الحجز.')));
setTextAll('.reservation-hero .hero-note-card p',pick(pair('Choose any available room and StayEase updates your estimated total immediately so guests can plan with confidence.','اختر أي غرفة متاحة وسيقوم StayEase بتحديث إجمالي الحجز التقديري فورًا حتى يخطط الضيف بثقة.')));
setTextAll('.booking-card .section-label',pick(pair('Your Details','بياناتك')));
setTextAll('.booking-card h2',pick(pair('Complete your stay information','أكمل بيانات الإقامة')));
setTextAll('.booking-card .card-intro',pick(pair('Fill in your details below, then calculate the total price for your selected room and length of stay.','أدخل بياناتك أدناه ثم احسب السعر الإجمالي للغرفة المختارة ومدة الإقامة.')));
setLeadingTextList('#bookingForm .field-grid:nth-of-type(1) label',[pick(pair('Full Name','الاسم الكامل')),pick(pair('Email Address','البريد الإلكتروني'))]);
setLeadingTextList('#bookingForm .field-grid:nth-of-type(2) label',[pick(pair('Select Room','اختر الغرفة')),pick(pair('Number of Nights','عدد الليالي'))]);
setLeadingTextList('#bookingForm .field-grid:nth-of-type(3) label',[pick(pair('Arrival Date','تاريخ الوصول')),pick(pair('Guests','عدد الضيوف'))]);
setLeadingText('#bookingForm > label:last-of-type',pick(pair('Special Request','طلب خاص')));
setTextAll('#calculateTotalButton',pick(pair('Calculate Total Price','احسب السعر الإجمالي')));
setTextAll('.summary-card .section-label',pick(pair('Booking Summary','ملخص الحجز')));
setTextAll('.summary-card h2',pick(pair('Your stay at a glance','ملخص إقامتك بسرعة')));
setTextList('.summary-row span',[pick(pair('Selected room','الغرفة المختارة')),pick(pair('Nightly rate','السعر الليلي')),pick(pair('Number of nights','عدد الليالي')),pick(pair('Estimated total','الإجمالي التقديري'))]);
setTextAll('.benefits-card .section-label',pick(pair('What Guests Get','ما الذي يحصل عليه الضيف')));
setTextAll('.benefits-card h2',pick(pair('Designed for a reassuring booking experience.','مصممة لتجربة حجز مطمئنة.')));
setTextList('.benefits-list li',[pick(pair('Room pricing shown clearly before confirmation.','عرض سعر الغرفة بوضوح قبل التأكيد.')),pick(pair('Easy reservation path from room details to booking.','مسار حجز سهل من تفاصيل الغرفة حتى إتمام الحجز.')),pick(pair('Flexible options for family, business, and leisure stays.','خيارات مرنة للإقامة العائلية والعملية والترفيهية.')),pick(pair('Space to add special requests for the hotel team.','مساحة لإضافة الطلبات الخاصة لفريق الفندق.'))]);
setAttrAll('#name','placeholder',pick(pair('Enter your full name','أدخل اسمك الكامل')));
setAttrAll('#email','placeholder',pick(pair('name@example.com','name@example.com')));
setAttrAll('#request','placeholder',pick(pair('Airport pickup, early check-in, baby crib, or any extra notes.','الاستقبال من المطار أو تسجيل دخول مبكر أو سرير طفل أو أي ملاحظات إضافية.')));
setRoomOptionLabels();
setGuestOptionLabels();
}

function translateContactPage(){
document.title=pick(pair('Contact Us','اتصل بنا'));
setTextAll('.contact-hero .eyebrow',pick(pair('Quick support, direct answers, and easier communication.','دعم سريع وإجابات مباشرة وتواصل أسهل.')));
setTextAll('.contact-hero h1',pick(pair('Contact Us','اتصل بنا')));
setTextAll('.contact-hero .page-lead',pick(pair('Reach the StayEase team for booking help, travel questions, reservation updates, or general support. The contact page now gives guests a clearer way to connect with the hotel.','تواصل مع فريق StayEase للمساعدة في الحجز أو الاستفسارات أو تحديثات الإقامة أو الدعم العام. أصبحت صفحة التواصل الآن أوضح وأسهل للزائر.')));
setTextList('.contact-hero .hero-points span',[pick(pair('Email and phone details','بيانات البريد والهاتف')),pick(pair('Simple support form','نموذج دعم بسيط')),pick(pair('Clear visitor guidance','إرشادات واضحة للزائر'))]);
setTextAll('.contact-info-card .section-label',pick(pair('Direct Contact','تواصل مباشر')));
setTextAll('.contact-info-card h2',pick(pair('Talk to the team in the way that suits you best.','تحدث مع الفريق بالطريقة التي تناسبك أكثر.')));
setTextList('.contact-detail h3',[pick(pair('Email','البريد الإلكتروني')),pick(pair('Phone','الهاتف')),pick(pair('Address','العنوان')),pick(pair('Support Hours','ساعات الدعم'))]);
setTextList('.contact-detail p',[pick(pair('info@stayease.example','info@stayease.example')),pick(pair('+02 01147794004','+02 01147794004')),pick(pair('مصر , العالمين','مصر , العالمين')),pick(pair('Daily: 9:00 AM - 10:00 PM','يوميًا: 9:00 صباحًا - 10:00 مساءً'))]);
setTextList('.contact-detail span',[pick(pair('Best for general questions and reservation support.','الأفضل للاستفسارات العامة ودعم الحجز.')),pick(pair('Ideal for urgent booking updates and quick assistance.','مناسب للتحديثات العاجلة والمساعدة السريعة.')),pick(pair('Convenient location for guests planning their visit.','موقع مناسب للضيوف الذين يخططون لزيارتهم.')),pick(pair('Responses are prioritized during operating hours.','يتم إعطاء الأولوية للردود خلال ساعات العمل.'))]);
setTextAll('.contact-form-card .section-label',pick(pair('Send A Message','أرسل رسالة')));
setTextAll('.contact-form-card h2',pick(pair('We are ready to help with your stay.','نحن جاهزون لمساعدتك في إقامتك.')));
setTextAll('.contact-form-card .card-intro',pick(pair('Send your inquiry and the team will respond as soon as possible with the information you need.','أرسل استفسارك وسيقوم الفريق بالرد عليك في أقرب وقت بالمعلومات التي تحتاجها.')));
setLeadingTextList('#contactForm .field-grid label',[pick(pair('Your Name','اسمك')),pick(pair('Email Address','البريد الإلكتروني'))]);
setLeadingTextList('#contactForm > label',[pick(pair('Subject','الموضوع')),pick(pair('Your Message','رسالتك'))]);
setTextAll('#contactSendButton',pick(pair('Send Message','إرسال الرسالة')));
setAttrList('#contactName,#contactEmail,#contactSubject,#contactText','placeholder',[pick(pair('Enter your full name','أدخل اسمك الكامل')),pick(pair('name@example.com','name@example.com')),pick(pair('Reservation question, room details, special request...','استفسار عن الحجز أو تفاصيل الغرف أو طلب خاص...')),pick(pair('Write your message here.','اكتب رسالتك هنا.'))]);
}

function translateVisionPage(){
document.title=pick(pair('Vision and Mission','الرؤية والرسالة'));
setTextAll('.vision-hero .eyebrow',pick(pair('The direction behind the StayEase experience.','الاتجاه الذي يقف خلف تجربة StayEase.')));
setTextAll('.vision-hero h1',pick(pair('Vision & Mission','الرؤية والرسالة')));
setTextAll('.vision-hero .page-lead',pick(pair('This page explains the purpose of StayEase and the experience the website aims to create for travelers. The goal is not only to show rooms, but to make hotel discovery, comparison, and booking feel simple, confident, and welcoming.','تشرح هذه الصفحة هدف StayEase ونوعية التجربة التي يسعى الموقع إلى تقديمها للمسافرين. الهدف ليس فقط عرض الغرف، بل جعل اكتشاف الإقامة والمقارنة والحجز تجربة بسيطة وواثقة ومريحة.')));
setTextList('.vision-hero .hero-points span',[pick(pair('Clear travel decisions','قرارات سفر واضحة')),pick(pair('Comfort-focused booking journey','رحلة حجز تركز على الراحة')),pick(pair('Trust built through simple design','ثقة مبنية على تصميم بسيط'))]);
setTextList('.vision-card .section-label',[pick(pair('Our Vision','رؤيتنا')),pick(pair('Our Mission','رسالتنا'))]);
setTextList('.vision-card h2',[pick(pair('To become a trusted digital destination for choosing the right stay with ease.','أن نصبح وجهة رقمية موثوقة لاختيار الإقامة المناسبة بسهولة.')),pick(pair('To present hotel categories, room details, and pricing in a way that supports faster decisions.','تقديم فئات الإقامة وتفاصيل الغرف والأسعار بطريقة تدعم اتخاذ القرار بسرعة.'))]);
setTextList('.vision-card > p:not(.section-label):not(.vision-highlight)',[pick(pair('StayEase aims to give travelers a calmer and more confident way to search for hotel options. The vision is centered on clarity, comfort, and trust so guests can understand what they are booking without confusion or unnecessary complexity.','يسعى StayEase إلى منح المسافرين طريقة أكثر هدوءًا وثقة للبحث عن خيارات الإقامة. تركز الرؤية على الوضوح والراحة والثقة حتى يفهم الضيف ما يحجزه دون تعقيد أو ارتباك.')),pick(pair('The mission of StayEase is to organize room types, features, and reservation details into a booking flow that feels direct and transparent. Every page should help guests compare options, understand pricing, and move toward booking with less effort.','رسالة StayEase هي تنظيم أنواع الغرف والمزايا وتفاصيل الحجز داخل تجربة تبدو مباشرة وشفافة. يجب أن تساعد كل صفحة الضيف على المقارنة وفهم الأسعار والتقدم نحو الحجز بسهولة أكبر.'))]);
setTextList('.vision-highlight',[pick(pair('The platform should feel easy to use from the first page to the final reservation step.','يجب أن تبدو المنصة سهلة الاستخدام من أول صفحة حتى آخر خطوة في الحجز.')),pick(pair('The mission focuses on useful room information, realistic prices, and a booking path that stays simple.','تركز الرسالة على معلومات مفيدة عن الغرف وأسعار واقعية ومسار حجز بسيط.'))]);
setTextAll('.principles-section .section-heading .section-label',pick(pair('Core Principles','المبادئ الأساسية')));
setTextAll('.principles-section .section-heading h2',pick(pair('What shapes the experience behind StayEase.','ما الذي يشكل التجربة وراء StayEase.')));
setTextAll('.principles-section .section-heading > p:last-of-type',pick(pair('These principles guide how the website communicates with guests and how the interface supports better hotel choices.','هذه المبادئ توجه طريقة تواصل الموقع مع الضيوف وكيف تدعم الواجهة اختيارات إقامة أفضل.')));
setTextList('.principle-card h3',[pick(pair('Clarity','الوضوح')),pick(pair('Comfort','الراحة')),pick(pair('Confidence','الثقة'))]);
setTextList('.principle-card p',[pick(pair('Guests should be able to see room types, nightly prices, and booking choices without hidden steps or confusing layouts.','يجب أن يتمكن الضيف من رؤية أنواع الغرف والأسعار وخيارات الحجز دون خطوات مخفية أو تصميمات مربكة.')),pick(pair('The browsing experience should feel calm, polished, and reassuring, especially for families and first-time visitors.','ينبغي أن تبدو تجربة التصفح هادئة وأنيقة ومطمئنة، خاصة للعائلات والزوار لأول مرة.')),pick(pair('Every page should help users make decisions with trust by showing relevant details before they commit to a reservation.','يجب أن تساعد كل صفحة المستخدم على اتخاذ القرار بثقة من خلال عرض التفاصيل المهمة قبل إتمام الحجز.'))]);
setTextAll('.vision-quote-card .section-label',pick(pair('StayEase Promise','وعد StayEase')));
setTextAll('.vision-quote-card h2',pick(pair('Helping travelers move from browsing to booking with more confidence and less friction.','مساعدة المسافرين على الانتقال من التصفح إلى الحجز بثقة أكبر واحتكاك أقل.')));
setTextAll('.vision-quote-card p',pick(pair('StayEase is designed to balance visual appeal with practical booking information, so visitors can enjoy the experience while still making informed decisions about their stay.','تم تصميم StayEase لتحقيق توازن بين الجاذبية البصرية والمعلومات العملية الخاصة بالحجز، بحيث يستمتع الزائر بالتجربة مع اتخاذ قرارات واعية حول إقامته.')));
setTextAll('.vision-cta .section-label',pick(pair('Next Step','الخطوة التالية')));
setTextAll('.vision-cta h2',pick(pair('Explore the rooms and see how the vision appears in the booking journey.','استكشف الغرف وشاهد كيف تظهر هذه الرؤية في رحلة الحجز.')));
setTextList('.vision-cta .cta-actions a',[pick(pair('View Room Details','اعرض تفاصيل الغرف')),pick(pair('Open Reservation','افتح صفحة الحجز'))]);
}

function translateAboutPage(){
document.title=pick(pair('About the Developer','عن المطور'));
setTextAll('.card h1',pick(pair('About the Developer','عن المطور')));
setStrongParagraph('.card p:nth-of-type(1)',pick(pair('Developer Name:','اسم المطور:')),pick(pair('Fouad Taher Fouad Mohamed','Fouad Taher Fouad Mohamed')));
setStrongParagraph('.card p:nth-of-type(2)',pick(pair('Email:','البريد الإلكتروني:')),pick(pair('s23510848eg@std.aou.edu.eg','s23510848eg@std.aou.edu.eg')));
setStrongParagraph('.card p:nth-of-type(3)',pick(pair('Project:','المشروع:')),pick(pair('Online Hotel Booking Website','موقع لحجز الإقامة عبر الإنترنت')));
setStrongParagraph('.card p:nth-of-type(4)',pick(pair('Languages Used:','اللغات المستخدمة:')),pick(pair('XHTML, CSS, and JavaScript','XHTML وCSS وJavaScript')));
setTextAll('.card p:nth-of-type(5)',pick(pair('This project demonstrates web page structure, graphical user interface design, navigation between pages, image usage, and JavaScript price calculation.','يعرض هذا المشروع بنية صفحات الويب وتصميم الواجهة الرسومية والتنقل بين الصفحات واستخدام الصور وحساب الأسعار باستخدام JavaScript.')));
}

function translateServicePage(pageKey){
if(pageKey==='airbnb-page'){
document.title=pick(pair('Airbnb Homes | Coming Soon in Egypt','منازل Airbnb | قريبًا في مصر'));
setTextAll('.service-hero .eyebrow',pick(pair('Coming Soon in Egypt','قريبًا في مصر')));
setTextAll('.service-hero h1',pick(pair('Airbnb Homes','منازل Airbnb')));
setTextAll('.service-hero .page-lead',pick(pair('StayEase is preparing an Airbnb-style homes concept for Egypt, designed for travelers who prefer private apartments, flexible short stays, and a more residential experience than a traditional hotel room.','يجهز StayEase مفهومًا لمنازل بنمط Airbnb في مصر، مخصصًا للمسافرين الذين يفضلون الشقق الخاصة والإقامات القصيرة المرنة وتجربة سكنية أقرب إلى المنزل من الغرفة الفندقية التقليدية.')));
setTextList('.service-hero .hero-points span',[pick(pair('Private furnished homes','منازل خاصة مفروشة')),pick(pair('Flexible short stays','إقامات قصيرة مرنة')),pick(pair('New beginning in Egypt','بداية جديدة في مصر'))]);
setTextList('.service-card .section-label',[pick(pair('What It Offers','ما الذي تقدمه الخدمة')),pick(pair('Launch Direction','اتجاه الإطلاق'))]);
setTextList('.service-card h2',[pick(pair('A home-style stay for guests who want more privacy, space, and flexibility.','إقامة بطابع منزلي للضيوف الباحثين عن خصوصية ومساحة ومرونة أكبر.')),pick(pair('The first phase is planned as an upcoming beginning in Egypt.','المرحلة الأولى مخطط لها كبداية قادمة في مصر.'))]);
setTextList('.service-card > p:not(.section-label):not(.service-highlight)',[pick(pair('This upcoming service focuses on apartment-style accommodation for short visits, city breaks, and longer comfortable stays. The idea is to give travelers a local and independent option while keeping the booking experience simple and well presented.','تركز هذه الخدمة القادمة على إقامة بنمط الشقق للزيارات القصيرة ورحلات المدن والإقامات الأطول المريحة. الفكرة هي منح المسافر خيارًا محليًا ومستقلًا مع الحفاظ على تجربة حجز بسيطة وواضحة.')),pick(pair('At this stage, the page introduces the concept and gives visitors a preview before the official rollout. The launch direction focuses on awareness first, then future availability in selected Egyptian destinations.','في هذه المرحلة تقدم الصفحة المفهوم وتعطي الزائر نظرة أولية قبل الإطلاق الرسمي. يركز اتجاه الإطلاق على التعريف بالخدمة أولًا ثم إتاحتها مستقبلًا في وجهات مصرية مختارة.'))]);
setTextList('.service-list li',[pick(pair('Private apartments and studios with a more residential feeling.','شقق واستوديوهات خاصة بإحساس أقرب إلى السكن المنزلي.')),pick(pair('Flexible stay choices for families, couples, and solo travelers.','خيارات إقامة مرنة للعائلات والأزواج والمسافرين الأفراد.')),pick(pair('Practical spaces with kitchens, living areas, and daily-use comfort.','مساحات عملية مع مطابخ ومناطق معيشة وراحة يومية.')),pick(pair('Useful for city travel, short-term living, and extended holiday stays.','مناسبة لرحلات المدن والمعيشة القصيرة والإقامات الطويلة خلال العطلات.'))]);
setTextAll('.service-highlight',pick(pair('Planned as a coming-soon expansion in Egypt with a focus on practical urban stays and comfortable home-style travel.','مخطط لها كتوسع قادم في مصر مع تركيز على الإقامات الحضرية العملية والسفر المريح بطابع منزلي.')));
setTextAll('.service-gallery-card .section-label',pick(pair('Preview','نظرة أولية')));
setTextAll('.service-gallery-card h2',pick(pair('How the Airbnb Homes concept is being presented.','كيف يتم تقديم مفهوم Airbnb Homes.')));
setTextAll('.service-gallery-card > .section-heading > p:last-of-type',pick(pair('The visual direction highlights furnished apartment living, independent stays, and a more flexible travel lifestyle.','يعكس الاتجاه البصري أسلوب السكن في الشقق المفروشة والإقامة المستقلة ونمط السفر الأكثر مرونة.')));
setTextAll('.service-cta .section-label',pick(pair('Interested?','مهتم بالخدمة؟')));
setTextAll('.service-cta h2',pick(pair('Contact StayEase to follow the Airbnb Homes launch and learn when it starts in Egypt.','تواصل مع StayEase لمتابعة إطلاق Airbnb Homes ومعرفة موعد بدايته في مصر.')));
setTextList('.service-cta .cta-actions a',[pick(pair('Contact Us','اتصل بنا')),pick(pair('Back to Categories','العودة إلى الفئات'))]);
}else if(pageKey==='student-page'){
document.title=pick(pair('Student Camp | Coming Soon in Egypt','المعسكر الطلابي | قريبًا في مصر'));
setTextAll('.service-hero .eyebrow',pick(pair('Coming Soon in Egypt','قريبًا في مصر')));
setTextAll('.service-hero h1',pick(pair('Student Camp','المعسكر الطلابي')));
setTextAll('.service-hero .page-lead',pick(pair('Student Camp is an upcoming concept designed for shared youth experiences, group stays, learning activities, and affordable accommodation. It is introduced here as one of the next beginning steps planned in Egypt.','Student Camp هو مفهوم قادم مصمم للتجارب الشبابية المشتركة والإقامات الجماعية والأنشطة التعليمية والإقامة الاقتصادية. يتم تقديمه هنا كواحدة من خطوات البداية القادمة المخطط لها في مصر.')));
setTextList('.service-hero .hero-points span',[pick(pair('Group-based stays','إقامات جماعية')),pick(pair('Activities and workshops','أنشطة وورش عمل')),pick(pair('Affordable student-focused concept','مفهوم اقتصادي موجه للطلاب'))]);
setTextList('.service-card .section-label',[pick(pair('What It Offers','ما الذي تقدمه الخدمة')),pick(pair('Launch Direction','اتجاه الإطلاق'))]);
setTextList('.service-card h2',[pick(pair('An upcoming stay and activity concept built for students and youth groups.','مفهوم إقامة وأنشطة قادم مصمم للطلاب والمجموعات الشبابية.')),pick(pair('The page presents an early introduction before the service begins in Egypt.','تعرض الصفحة تعريفًا مبكرًا قبل بدء الخدمة في مصر.'))]);
setTextList('.service-card > p:not(.section-label):not(.service-highlight)',[pick(pair('The idea behind Student Camp is to combine shared accommodation with learning, teamwork, and community-based activities. It can support school groups, university programs, short camps, and seasonal youth experiences that need structure, energy, and affordability.','فكرة Student Camp تقوم على الجمع بين الإقامة المشتركة والتعلم والعمل الجماعي والأنشطة المجتمعية. ويمكن أن تخدم المجموعات المدرسية والبرامج الجامعية والمعسكرات القصيرة والتجارب الشبابية الموسمية التي تحتاج إلى تنظيم وحيوية وتكلفة مناسبة.')),pick(pair('This is a preview page that helps visitors understand the concept, its audience, and its future direction. The first phase is positioned as an upcoming beginning in Egypt, with the goal of building awareness around the service before launch.','هذه صفحة تعريفية تساعد الزائر على فهم الفكرة والجمهور المستهدف واتجاهها المستقبلي. يتم تقديم المرحلة الأولى كبداية قادمة في مصر بهدف بناء الوعي بالخدمة قبل إطلاقها.'))]);
setTextList('.service-list li',[pick(pair('Affordable group accommodation with a community atmosphere.','إقامة جماعية اقتصادية بطابع مجتمعي.')),pick(pair('Activity spaces for workshops, collaboration, and student interaction.','مساحات للأنشطة وورش العمل والتعاون والتفاعل بين الطلاب.')),pick(pair('Suitable for youth programs, educational trips, and camp-style stays.','مناسبة للبرامج الشبابية والرحلات التعليمية والإقامات بطابع المعسكرات.')),pick(pair('A concept focused on participation, belonging, and memorable group experiences.','مفهوم يركز على المشاركة والانتماء والتجارب الجماعية المميزة.'))]);
setTextAll('.service-highlight',pick(pair('Planned as a coming-soon youth and student experience in Egypt with a focus on shared activities, affordability, and organized group stays.','مخطط له كتجربة شبابية وطلابية قادمة في مصر مع تركيز على الأنشطة المشتركة والتكلفة المناسبة والإقامات الجماعية المنظمة.')));
setTextAll('.service-gallery-card .section-label',pick(pair('Preview','نظرة أولية')));
setTextAll('.service-gallery-card h2',pick(pair('The Student Camp idea combines accommodation, community, and active participation.','فكرة Student Camp تجمع بين الإقامة والمجتمع والمشاركة الفعالة.')));
setTextAll('.service-gallery-card > .section-heading > p:last-of-type',pick(pair('The visuals below reflect both the camp environment and the student-centered energy behind the upcoming experience.','تعكس الصور التالية بيئة المعسكر والطاقة الطلابية التي تقف خلف هذه التجربة القادمة.')));
setTextAll('.service-cta .section-label',pick(pair('Interested?','مهتم بالخدمة؟')));
setTextAll('.service-cta h2',pick(pair('Contact StayEase to ask about Student Camp and follow the beginning of the launch in Egypt.','تواصل مع StayEase للاستفسار عن Student Camp ومتابعة بداية الإطلاق في مصر.')));
setTextList('.service-cta .cta-actions a',[pick(pair('Contact Us','اتصل بنا')),pick(pair('Back to Categories','العودة إلى الفئات'))]);
}
}

function setRoomOptionLabels(){
var options=document.querySelectorAll('#room option');
for(var i=0;i<options.length;i++){
var value=options[i].value;
if(I18N.rooms.options[value]){options[i].textContent=pick(I18N.rooms.options[value]);}
}
}

function setGuestOptionLabels(){
var options=document.querySelectorAll('#guests option');
for(var i=0;i<options.length&&i<I18N.rooms.guests.length;i++){
options[i].textContent=pick(I18N.rooms.guests[i]);
}
}

function detectPageKey(){
var body=document.body;
if(body.classList.contains('home-page')){return'home';}
if(body.classList.contains('categories-page')){return'categories';}
if(body.classList.contains('rooms-page')){return'rooms';}
if(body.classList.contains('reservation-page')){return'reservation';}
if(body.classList.contains('contact-page')){return'contact';}
if(body.classList.contains('vision-page')){return'vision';}
if(body.classList.contains('about-page')){return'about';}
if(body.classList.contains('airbnb-page')){return'airbnb-page';}
if(body.classList.contains('student-page')){return'student-page';}
return'';
}

function applyTranslations(){
translateCommon();
var pageKey=detectPageKey();
if(pageKey==='home'){translateHomePage();}
if(pageKey==='categories'){translateCategoriesPage();}
if(pageKey==='rooms'){translateRoomsPage();}
if(pageKey==='reservation'){translateReservationPage();}
if(pageKey==='contact'){translateContactPage();}
if(pageKey==='vision'){translateVisionPage();}
if(pageKey==='about'){translateAboutPage();}
if(pageKey==='airbnb-page'||pageKey==='student-page'){translateServicePage(pageKey);}
document.dispatchEvent(new CustomEvent('stayease:languagechange',{detail:{language:currentLanguage}}));
}

function detectInitialLanguage(){
var savedLanguage='';
try{savedLanguage=window.localStorage.getItem(STORAGE_KEY)||'';}catch(error){savedLanguage='';}
if(SUPPORTED_LANGUAGES[savedLanguage]){return savedLanguage;}
var browserLanguage=(navigator.language||navigator.userLanguage||'en').toLowerCase();
return browserLanguage.indexOf('ar')===0?'ar':'en';
}

function setLanguage(language){
if(!SUPPORTED_LANGUAGES[language]){return;}
currentLanguage=language;
try{window.localStorage.setItem(STORAGE_KEY,language);}catch(error){}
applyTranslations();
}

function initializeI18n(){
currentLanguage=detectInitialLanguage();
createLanguageSwitcher();
applyTranslations();
}

window.StayEaseI18n={
getCurrentLanguage:function(){return currentLanguage;},
getText:getText,
getRoomLabel:getRoomLabel,
formatText:formatText,
setLanguage:setLanguage
};

document.addEventListener('DOMContentLoaded',initializeI18n);
})();
