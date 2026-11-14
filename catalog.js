// Catálogo de Kipo Café. Para cambiar precios o productos edita SOLO este archivo.
// available:false => aparece como "Agotado".
const CATEGORIES = [
  { id: 'cafes', name: 'Cafés calientes' },
  { id: 'frias', name: 'Bebidas frías' },
  { id: 'postres', name: 'Postres' },
  { id: 'complementos', name: 'Complementos' },
];
const EXTRAS = {
  milks: [
    { id: 'normal', label: 'Leche normal', price: 0 },
    { id: 'deslac-entera', label: 'Deslactosada entera', price: 0 },
    { id: 'deslac-light', label: 'Deslactosada light', price: 0 },
    { id: 'avena', label: 'Avena', price: 12 },
    { id: 'almendra', label: 'Almendra', price: 12 },
    { id: 'soya', label: 'Soya', price: 12 },
    { id: 'coco', label: 'Coco', price: 12 },
  ],
  syrups: [
    { id: 'vainilla', label: 'Vainilla', price: 10 },
    { id: 'caramelo', label: 'Caramelo', price: 10 },
    { id: 'avellana', label: 'Avellana', price: 10 },
    { id: 'irlandesa', label: 'Crema irlandesa', price: 10 },
  ],
  shot: { price: 15, max: 3 }, // 1 shot adicional (30 ml)
};
const cl = (c, g) => [{ id: 'chico', label: 'Chico', price: c }, { id: 'grande', label: 'Grande', price: g }];
const uno = (p) => [{ id: 'unico', label: 'Único', price: p }];
const PRODUCTS = [
  { id: 'espresso', cat: 'cafes', name: 'Espresso', custom: true, available: true, sizes: cl(40, 48),
    desc: 'Extracción concentrada de café de especialidad con crema densa y notas tostadas.' },
  { id: 'americano', cat: 'cafes', name: 'Americano', custom: true, available: true, sizes: cl(48, 56),
    desc: 'Carga de espresso diluida en agua caliente para un perfil limpio y aromático.' },
  { id: 'cappuccino', cat: 'cafes', name: 'Cappuccino', custom: true, available: true, sizes: cl(58, 68),
    desc: 'Espresso, leche vaporizada y microespuma cremosa.' },
  { id: 'latte', cat: 'cafes', name: 'Latte', custom: true, available: true, sizes: cl(62, 72),
    desc: 'Espresso suave, leche texturizada y un toque de espuma.' },
  { id: 'iced-latte', cat: 'frias', name: 'Iced Latte', custom: true, available: true, sizes: cl(68, 78),
    desc: 'Espresso sobre hielo y leche fría a elección.' },
  { id: 'cold-brew', cat: 'frias', name: 'Café Frío (Cold Brew)', custom: true, available: true, sizes: cl(70, 80),
    desc: 'Infusión en frío durante 16 horas, de acidez baja, cuerpo sedoso y notas achocolatadas.' },
  { id: 'brownie', cat: 'postres', name: 'Brownie de Chocolate', available: true, sizes: uno(55),
    desc: 'Cuadro denso y húmedo de chocolate semiamargo con trozos de nuez.' },
  { id: 'cheesecake', cat: 'postres', name: 'Cheesecake Clásico', available: true, sizes: uno(75),
    desc: 'Rebanada cremosa de queso sobre base crujiente de galleta, con coulis de frutos rojos.' },
  { id: 'zanahoria', cat: 'postres', name: 'Pastel de Zanahoria', available: true, seasonal: true, sizes: uno(78),
    desc: 'Bizcocho especiado con nuez, pasas y betún suave de queso crema.' },
  { id: 'sandwich', cat: 'complementos', name: 'Sándwich de Pavo y Queso', available: true, sizes: uno(95),
    desc: 'Pan artesanal tostado, pavo, gouda, espinaca y aderezo de la casa.' },
  { id: 'croissant', cat: 'complementos', name: 'Croissant de Mantequilla', available: true, sizes: uno(45),
    desc: 'Hojaldre dorado por fuera y suave por dentro.' },
];
