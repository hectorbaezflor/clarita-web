import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";



let productos = [];
let categoriaActiva = 'todo';

async function cargarProductos() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '<p class="cargando">Cargando productos...</p>';

  const snapshot = await getDocs(collection(db, 'productos'));
  productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  const visibles = productos.filter(p =>
    categoriaActiva === 'todo' || p.categoria === categoriaActiva
  );

  if (visibles.length === 0) {
    grid.innerHTML = '<p class="vacio">No hay productos en esta categoría todavía.</p>';
    return;
  }

  visibles.forEach(p => {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
      <div class="thumb">${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}">` : '<span>Foto</span>'}</div>
      <div class="card-body">
        <span class="card-cat">${p.categoria}</span>
        <h3>${p.nombre}</h3>
        <p class="card-desc">${p.descripcion || ''}</p>
        <span class="card-precio">$${p.precio}</span>
      </div>
    `;
    grid.appendChild(article);
  });
}

const botonesFiltro = document.querySelectorAll('.filtro');
botonesFiltro.forEach(boton => {
  boton.addEventListener('click', () => {
    categoriaActiva = boton.dataset.categoria;
    botonesFiltro.forEach(b => b.classList.remove('activo'));
    boton.classList.add('activo');
    renderGrid();
  });
});

cargarProductos();



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