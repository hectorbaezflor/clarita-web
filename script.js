const botonesFiltro = document.querySelectorAll('.filtro');
const tarjetas = document.querySelectorAll('.card');

botonesFiltro.forEach(boton => {
  boton.addEventListener('click', () => {
    const categoria = boton.dataset.categoria;

    botonesFiltro.forEach(b => b.classList.remove('activo'));
    boton.classList.add('activo');

    tarjetas.forEach(tarjeta => {
      const coincide = categoria === 'todo' || tarjeta.dataset.categoria === categoria;
      tarjeta.style.display = coincide ? '' : 'none';
    });
  });
});



const burgerBtn = document.getElementById('burgerBtn');
const menuList = document.getElementById('menuList');

burgerBtn.addEventListener('click', () => {
  menuList.classList.toggle('abierto');
});

menuList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuList.classList.remove('abierto');
  });
});