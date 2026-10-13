// Lista única de produtos. Toda a loja vai ler daqui.
// O preço é um NÚMERO (89.9), nunca texto, para podermos fazer contas.
const produtos = [
    {
        id: 1,
        nome: "Vaso Sakura",
        categoria: "vasos",
        descricao: "Vaso de cerâmica rosa feito à mão.",
        preco: 89.90,
        imagem: "img/vaso-sakura.jpg"
    },
    {
        id: 2,
        nome: "Vaso Pétala",
        categoria: "vasos",
        descricao: "Vaso branco com acabamento fosco.",
        preco: 129.90,
        imagem: "img/vaso-petala.jpg"
    },
    {
        id: 3,
        nome: "Prato Ciliegio",
        categoria: "ceramicas",
        descricao: "Prato decorativo pintado à mão.",
        preco: 59.90,
        imagem: "img/prato-ciliegio.jpg"
    },
    {
        id: 4,
        nome: "Vela Flor de Cerejeira",
        categoria: "velas",
        descricao: "Vela aromática de cerejeira, 200 g.",
        preco: 39.90,
        imagem: "img/vela-cerejeira.jpg"
    }
];