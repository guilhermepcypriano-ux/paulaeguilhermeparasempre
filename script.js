const menuToggle=document.querySelector('.menu-toggle'),navLinks=document.querySelector('.nav-links');
menuToggle?.addEventListener('click',()=>navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

// Contagem regressiva para 14/11/2026 às 16h, horário de São Paulo.
const weddingDate=new Date('2026-11-14T16:00:00-03:00').getTime();
function updateCountdown(){
  let d=Math.max(0,weddingDate-Date.now());
  const vals=[
    Math.floor(d/86400000),
    Math.floor(d/3600000)%24,
    Math.floor(d/60000)%60,
    Math.floor(d/1000)%60
  ];
  ['days','hours','minutes','seconds'].forEach((id,i)=>{
    const el=document.getElementById(id);
    if(el) el.textContent=String(vals[i]).padStart(2,'0');
  });
}
updateCountdown();setInterval(updateCountdown,1000);

// Lista de presentes (demonstração; pagamento será conectado depois).
const modal=document.getElementById('gift-modal'),modalGift=document.getElementById('modal-gift'),modalPrice=document.getElementById('modal-price');
document.querySelectorAll('.gift-button').forEach(btn=>btn.addEventListener('click',()=>{
  modalGift.textContent=btn.dataset.gift;modalPrice.textContent='R$ '+Number(btn.dataset.price).toLocaleString('pt-BR');
  modal.classList.add('open');modal?.setAttribute('aria-hidden','false');
}));
function closeModal(){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true')}
document.querySelector('.modal-close')?.addEventListener('click',closeModal);
document.getElementById('modal-ok')?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});

// RSVP — envia as confirmações para a planilha Google Sheets via Apps Script.
const RSVP_ENDPOINT='https://script.google.com/macros/s/AKfycbwItLHjHVtfGnhPNaRH8-41imf9xN18U_T_ZyVizOuv21dqvB8qF57crRW5ufQEu0RmZA/exec';

document.getElementById('rsvp-form')?.addEventListener('submit',async e=>{
  e.preventDefault();

  const form=e.target;
  const name=document.getElementById('guest-name').value.trim();
  const phone=document.getElementById('guest-phone').value.trim();
  const attendance=document.getElementById('attendance').value;
  const count=document.getElementById('guest-count').value;
  const companions=document.getElementById('companions').value.trim() || '—';
  const message=document.getElementById('message').value.trim() || '—';
  const result=document.getElementById('rsvp-result');
  const submit=form.querySelector('button[type="submit"],input[type="submit"]');

  if(!name || !phone || !attendance || !count){
    result.hidden=false;
    result.innerHTML='<strong>Preencha os campos obrigatórios.</strong>';
    return;
  }

  const dados={
    nome:name,
    telefone:phone,
    presenca:attendance,
    pessoas:count,
    acompanhantes:companions,
    observacao:message
  };

  if(submit) submit.disabled=true;
  result.hidden=false;
  result.innerHTML='<strong>Enviando sua confirmação...</strong>';

  try{
    // text/plain mantém o envio como requisição simples, sem preflight CORS.
    await fetch(RSVP_ENDPOINT,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'text/plain;charset=UTF-8'},
      body:JSON.stringify(dados)
    });

    result.innerHTML='<strong>Presença confirmada! ❤️</strong><br><br>'+
      'Obrigado, <b>'+name.replace(/[<>]/g,'')+'</b>. Sua confirmação foi enviada para a lista de convidados.';
    form.reset();
  }catch(err){
    result.innerHTML='<strong>Não foi possível enviar agora.</strong><br><br>'+
      'Verifique sua conexão e tente novamente. Se o problema continuar, entre em contato com os noivos.';
    console.error(err);
  }finally{
    if(submit) submit.disabled=false;
  }
});

// Galeria ampliável.
const lightbox=document.getElementById('lightbox'),lightboxImage=document.getElementById('lightbox-image');
document.querySelectorAll('.real-gallery img').forEach(img=>img.addEventListener('click',()=>{
  lightboxImage.src=img.src;lightboxImage.alt=img.alt;lightbox.classList.add('open');
}));
function closeLightbox(){lightbox?.classList.remove('open');if(lightboxImage)lightboxImage.src=''}
document.querySelector('.lightbox-close')?.addEventListener('click',closeLightbox);
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});


document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('copyPix');
  const key = document.getElementById('pixKey');
  if (btn && key) {
    btn.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(key.textContent.trim());
        const old = btn.textContent;
        btn.textContent = 'Chave copiada!';
        setTimeout(() => btn.textContent = old, 1800);
      } catch (e) {
        alert('Chave Pix: ' + key.textContent.trim());
      }
    });
  }
});
