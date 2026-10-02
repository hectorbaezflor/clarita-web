import { db, auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://bwtjaxssvaefrsbpefnn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dGpheHNzdmFlZnJzYnBlZm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5MDcxMDMsImV4cCI6MjEwNjQ4MzEwM30.zuq11h1-qx6u-4EJpTmCCoVVYmJrZ7F4Egq7OBjsV3w' // tu anon key completa
);

// ---------- login ----------
const loginBox = document.getElementById('loginBox');
const panelBox = document.getElementById('panelBox');
const loginError = document.getElementById('loginError');

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    loginError.textContent = 'Email o contraseña incorrectos.';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  loginBox.classList.toggle('hidden', !!user);
  panelBox.classList.toggle('hidden', !user);
  if (user) {
    document.getElementById('userEmail').textContent = user.email;
    cargarLista();
  }
});

// ---------- subir producto ----------

let editandoId = null;
let imagenActual = '';
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const form = document.getElementById('prodForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMsg.textContent = 'Guardando...';

  const archivo = document.getElementById('pFoto').files[0];
  let urlImagen = imagenActual;

  if (archivo) {
    const nombreArchivo = `${Date.now()}-${archivo.name}`;
    const { error: errorSubida } = await supabase.storage
      .from('productos')
      .upload(nombreArchivo, archivo);

    if (errorSubida) {
      formMsg.textContent = 'Error subiendo la foto: ' + errorSubida.message;
      return;
    }

    const { data } = supabase.storage.from('productos').getPublicUrl(nombreArchivo);
    urlImagen = data.publicUrl;
  }

  const datos = {
    nombre: document.getElementById('pNombre').value,
    categoria: document.getElementById('pCategoria').value,
    precio: document.getElementById('pPrecio').value,
    descripcion: document.getElementById('pDescripcion').value,
    imagen: urlImagen
  };

  if (editandoId) {
    await updateDoc(doc(db, 'productos', editandoId), datos);
    formMsg.textContent = 'Producto actualizado ✔';
  } else {
    await addDoc(collection(db, 'productos'), datos);
    formMsg.textContent = 'Producto guardado ✔';
  }

  salirModoEdicion();
  cargarLista();
});

function entrarModoEdicion(p, id) {
  editandoId = id;
  imagenActual = p.imagen || '';
  document.getElementById('pNombre').value = p.nombre;
  document.getElementById('pCategoria').value = p.categoria;
  document.getElementById('pPrecio').value = p.precio;
  document.getElementById('pDescripcion').value = p.descripcion;
  submitBtn.textContent = 'Actualizar producto';
  cancelEditBtn.classList.remove('hidden');
  formMsg.textContent = '';
  form.scrollIntoView({ behavior: 'smooth' });
}

function salirModoEdicion() {
  editandoId = null;
  imagenActual = '';
  form.reset();
  submitBtn.textContent = 'Guardar producto';
  cancelEditBtn.classList.add('hidden');
}

cancelEditBtn.addEventListener('click', salirModoEdicion);

// ---------- listar y borrar ----------
async function cargarLista() {
  const cont = document.getElementById('listaProductos');
  cont.innerHTML = 'Cargando...';

  const snapshot = await getDocs(collection(db, 'productos'));
  cont.innerHTML = '';

  snapshot.docs.forEach(docSnap => {
  const p = docSnap.data();
  const row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML = `
    <span>${p.nombre} — ${p.categoria}</span>
    <div style="display:flex; gap:14px;">
      <button class="editar">Editar</button>
      <button class="eliminar">Eliminar</button>
    </div>
  `;
  row.querySelector('.editar').addEventListener('click', () => entrarModoEdicion(p, docSnap.id));
  row.querySelector('.eliminar').addEventListener('click', async () => {
    if (!confirm('¿Eliminar este producto?')) return;
    await deleteDoc(doc(db, 'productos', docSnap.id));
    cargarLista();
  });
  cont.appendChild(row);
  });
}