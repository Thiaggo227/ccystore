// ==========================
// MENU HAMBÚRGUER
// ==========================
const menuIcon = document.getElementById("menu-icon");
const menu = document.getElementById("menu");

menuIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("active");
  menuIcon.classList.toggle("bi-list");
  menuIcon.classList.toggle("bi-x");
});

document.addEventListener("click", (e) => {
  if (
    menu.classList.contains("active") &&
    !menu.contains(e.target) &&
    !menuIcon.contains(e.target)
  ) {
    menu.classList.remove("active");
    menuIcon.classList.remove("bi-x");
    menuIcon.classList.add("bi-list");
  }
});

// ==========================
// FECHAR TODOS OS MODAIS
// ==========================
function fecharTodosModais() {
  document
    .querySelectorAll(
      ".modalTamanho, .modalProduto, .modalCompra, .modalCarrinho"
    )
    .forEach((m) => m.classList.remove("ativo"));
}

// ==========================
// CARDS
// ==========================
const cards = document.querySelectorAll(".box, .mid");
cards.forEach((card, i) => (card.dataset.cardId = i));

let cardAtual = null;

// ==========================
// MODAL TAMANHO
// ==========================
const modalTamanho = document.createElement("div");
modalTamanho.className = "modalTamanho";
modalTamanho.innerHTML = `
  <div class="modalTamanhoConteudo">
    <span class="fecharTamanho">&times;</span>
    <h2 id="tituloTamanho"></h2>
    <div class="tamanhos">
      <button>P</button>
      <button>M</button>
      <button>G</button>
      <button>GG</button>
      <button>XG</button>
    </div>
  </div>
`;
document.body.appendChild(modalTamanho);

const fecharTamanho = modalTamanho.querySelector(".fecharTamanho");
const tituloTamanho = modalTamanho.querySelector("#tituloTamanho");

function abrirModalTamanho(nomeProduto, card) {
  cardAtual = card;
  fecharTodosModais();
  tituloTamanho.textContent = nomeProduto;
  modalTamanho.classList.add("ativo");
}

fecharTamanho.onclick = () => modalTamanho.classList.remove("ativo");

modalTamanho.addEventListener("click", (e) => {
  if (e.target === modalTamanho) modalTamanho.classList.remove("ativo");
});

// 👉 Selecionar tamanho
modalTamanho.querySelectorAll(".tamanhos button").forEach((btn) => {
  btn.onclick = () => {
    if (!cardAtual) return;

    const tamanho = btn.textContent;

    cardAtual.dataset.tamanhoSelecionado = tamanho;
    tamanhoInput.value = tamanho;

    const btnCard = cardAtual.querySelector(".btnTamanho");

    btnCard.innerHTML = `
      TAMANHO ${tamanho}
      <i class="bi bi-x-circle removerTamanho"></i>
    `;

    modalTamanho.classList.remove("ativo");
  };
});

// ==========================
// MODAL PRODUTO
// ==========================
const modal = document.createElement("div");
modal.className = "modalProduto";
modal.innerHTML = `
  <div class="modalConteudo">
    <span class="fecharModal">&times;</span>
    <img id="modalImg">
    <h2 id="modalNome"></h2>
    <p id="modalValor"></p>
    <div id="modalBotoes"></div>
  </div>
`;
document.body.appendChild(modal);

const btnFechar = modal.querySelector(".fecharModal");
const modalBotoes = modal.querySelector("#modalBotoes");

cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest(".btnTamanho, .btnBuy, .btnCart")) return;

    fecharTodosModais();
    cardAtual = card;

    const img = card.querySelector(".imgShop").src;
    const nome = card.querySelector(".pBox").textContent;
    const valor = card.querySelector(".pValor").textContent;

    modal.querySelector("#modalImg").src = img;
    modal.querySelector("#modalNome").textContent = nome;
    modal.querySelector("#modalValor").textContent = valor;

    modalBotoes.innerHTML =
      card.querySelector(".btnTamanho").outerHTML +
      card.querySelector(".btnBuy").outerHTML +
      card.querySelector(".btnCart").outerHTML;

    modalBotoes.querySelector(".btnTamanho").onclick = (e) => {
      e.stopPropagation();
      abrirModalTamanho(nome, card);
    };

    modalBotoes.querySelector(".btnBuy").onclick = (e) => {
      e.stopPropagation();
      abrirModalCompra();
    };

    modal.classList.add("ativo");
  });
});

btnFechar.onclick = () => modal.classList.remove("ativo");

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("ativo");
});

// ==========================
// MODAL COMPRA
// ==========================
const modalCompra = document.createElement("div");
modalCompra.className = "modalCompra";
modalCompra.innerHTML = `
  <div class="modalCompraConteudo">
    <span class="fecharCompra">&times;</span>
    <h2>Finalize sua compra</h2>
    <form id="formCompra">
      <input type="text" placeholder="Nome completo" required>
      <input type="email" placeholder="Email" required>
      <input type="text" placeholder="Endereço" required>
      <input type="tel" placeholder="Telefone" required>
      <input type="text" placeholder="CEP" required>

      <input type="hidden" id="tamanhoSelecionado">

      <select id="formaPagamento" required>
        <option value="">Forma de pagamento</option>
        <option>Cartão de crédito</option>
        <option>Cartão de débito</option>
        <option>Dinheiro</option>
        <option>PIX</option>
        <option>Boleto</option>
      </select>

      <div id="trocoContainer" style="display:none">
        <label>Troco para quanto?</label>
        <input type="number" id="trocoValor" min="0">
        <div>
          <input type="checkbox" id="semTroco">
          <label>Não precisa de troco</label>
        </div>
      </div>

      <p id="avisoTamanho"></p>
    <button type="submit" class="btnFinalizarCarrinho">
  Finalizar compra
</button>

    </form>
  </div>
`;
document.body.appendChild(modalCompra);

const fecharCompra = modalCompra.querySelector(".fecharCompra");
const formCompra = modalCompra.querySelector("#formCompra");
const formaPagamento = modalCompra.querySelector("#formaPagamento");
const trocoContainer = modalCompra.querySelector("#trocoContainer");
const trocoValor = modalCompra.querySelector("#trocoValor");
const semTroco = modalCompra.querySelector("#semTroco");
const tamanhoInput = modalCompra.querySelector("#tamanhoSelecionado");
const avisoTamanho = modalCompra.querySelector("#avisoTamanho");

function abrirModalCompra() {
  if (cardAtual?.dataset.tamanhoSelecionado) {
    tamanhoInput.value = cardAtual.dataset.tamanhoSelecionado;
  }

  fecharTodosModais();
  modalCompra.classList.add("ativo");
}

fecharCompra.onclick = () => modalCompra.classList.remove("ativo");

modalCompra.addEventListener("click", (e) => {
  if (e.target === modalCompra) modalCompra.classList.remove("ativo");
});

// ==========================
// LÓGICA TROCO
// ==========================
formaPagamento.onchange = () => {
  trocoContainer.style.display =
    formaPagamento.value === "Dinheiro" ? "block" : "none";

  trocoValor.value = "";
  semTroco.checked = false;
  trocoValor.disabled = false;
};

semTroco.onchange = () => {
  trocoValor.disabled = semTroco.checked;
  if (semTroco.checked) trocoValor.value = "";
};

// ==========================
// REMOVER TAMANHO (X)
// ==========================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("removerTamanho")) {
    e.stopPropagation();

    const card = e.target.closest(".box, .mid");

    delete card.dataset.tamanhoSelecionado;
    const btn = card.querySelector(".btnTamanho");
    btn.innerHTML = `
      VER TAMANHO <i class="bi bi-star" style="font-size:15px;"></i>
`;

    tamanhoInput.value = "";
  }
});

// ==========================
// CARRINHO
// ==========================
let carrinho = [];

document.addEventListener("click", (e) => {
  const btnTamanho = e.target.closest(".btnTamanho");
  if (btnTamanho && !e.target.classList.contains("removerTamanho")) {
    e.stopPropagation();
    const card = btnTamanho.closest(".box, .mid");
    const nome = card.querySelector(".pBox").textContent;
    abrirModalTamanho(nome, card);
    return;
  }

  const btnBuy = e.target.closest(".btnBuy");
  if (btnBuy) {
    e.stopPropagation();
    cardAtual = btnBuy.closest(".box, .mid");
    abrirModalCompra();
    return;
  }

  const btnCart = e.target.closest(".btnCart");
  if (btnCart) {
    const card = btnCart.closest(".box, .mid");
    const nome = card.querySelector(".pBox").textContent;
    const tamanho = card.dataset.tamanhoSelecionado;

    if (!tamanho) {
      mostrarMensagem("Escolha o tamanho primeiro", "#d9534f");
      return;
    }

    carrinho.push({ nome, tamanho });
    mostrarMensagem("Adicionado ao carrinho", "#0e8f45");
  }
});

// ==========================
// MENSAGEM CENTRALIZADA
// ==========================
function mostrarMensagem(texto, cor) {
  const msg = document.createElement("span");
  msg.textContent = texto;

  msg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: bold;
    background: ${cor};
    color: #fff;
    z-index: 9999;
    font-size: 16px;
    animation: aparecerMsg 0.2s ease-out;
  `;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.style.opacity = "0";
    msg.style.transition = "opacity 0.3s";
    setTimeout(() => msg.remove(), 300);
  }, 1800);
}


// ==========================
// FINALIZAR COMPRA
// ==========================
formCompra.onsubmit = (e) => {
  e.preventDefault();

  if (!tamanhoInput.value) {
    avisoTamanho.textContent = "⚠️ Escolha um tamanho primeiro";
    avisoTamanho.style.color = "#d9534f";
    return;
  }

  avisoTamanho.textContent = "";

  mostrarMensagem(
    `Compra finalizada! Tamanho: ${tamanhoInput.value}`,
    "#0e8f45"
  );

  setTimeout(() => {
    modalCompra.classList.remove("ativo");
    formCompra.reset();
    tamanhoInput.value = "";
    trocoContainer.style.display = "none";
  }, 1500);
};
// ==========================
// MODAL CARRINHO
// ==========================
const modalCarrinho = document.createElement("div");
modalCarrinho.className = "modalCarrinho";
modalCarrinho.innerHTML = `
  <div class="modalCarrinhoConteudo">
    <span class="fecharCarrinho">&times;</span>
    <h2>Seu Carrinho</h2>
    <ul id="listaCarrinho"></ul>
    <p id="carrinhoVazio">Carrinho vazio</p>

    <button id="finalizarCarrinho" class="btnFinalizarCarrinho">
      Finalizar compra
    </button>
  </div>
`;
document.body.appendChild(modalCarrinho);

const btnAbrirCarrinho = document.querySelector(".btnCar");
const fecharCarrinho = modalCarrinho.querySelector(".fecharCarrinho");
const listaCarrinho = modalCarrinho.querySelector("#listaCarrinho");
const carrinhoVazio = modalCarrinho.querySelector("#carrinhoVazio");
const btnFinalizarCarrinho =
  modalCarrinho.querySelector("#finalizarCarrinho");

// ==========================
// ATUALIZAR CARRINHO
// ==========================
function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    carrinhoVazio.style.display = "block";
    btnFinalizarCarrinho.style.display = "none";
    return;
  }

  carrinhoVazio.style.display = "none";
  btnFinalizarCarrinho.style.display = "block";

  carrinho.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} — Tamanho: ${item.tamanho}
      <button class="removerItem" data-index="${i}">❌</button>
    `;
    listaCarrinho.appendChild(li);
  });
}

// ==========================
// ABRIR CARRINHO
// ==========================
btnAbrirCarrinho.addEventListener("click", () => {
  fecharTodosModais();
  atualizarCarrinho();
  modalCarrinho.classList.add("ativo");
});

// ==========================
// BOTÃO FINALIZAR COMPRA
// ==========================
btnFinalizarCarrinho.addEventListener("click", () => {
  if (carrinho.length === 0) {
    mostrarMensagem("Carrinho vazio", "#d9534f");
    return;
  }

  modalCarrinho.classList.remove("ativo");
  abrirModalCompra();
});

// ==========================
// FECHAR / REMOVER ITEM
// ==========================
fecharCarrinho.onclick = () =>
  modalCarrinho.classList.remove("ativo");

modalCarrinho.addEventListener("click", (e) => {
  if (e.target === modalCarrinho)
    modalCarrinho.classList.remove("ativo");

  if (e.target.classList.contains("removerItem")) {
    const index = e.target.dataset.index;
    carrinho.splice(index, 1);
    atualizarCarrinho();
  }
});


