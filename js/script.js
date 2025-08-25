const supabase_url = "https://qphxpdbpeyngrunuxpjw.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHhwZGJwZXluZ3J1bnV4cGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzA0MzksImV4cCI6MjA3MTIwNjQzOX0.NMXBahgj5teLre42_rFEhWvdwIqKPxf6tHP0gCnx7Zw"

const supabase = window.supabase.createClient(supabase_url, supabase_key);

function abrirFormulario (id){
    document.getElementById(id).classList.toggle("oculto");
}

async function carregarObras(){
    const {data, error} = await supabase
        .from("obras")
        .select("*");
    if (error){
        console.error("Erro ao carregar Obras:", error);
        return;
    }

    let selectObra = document.getElementById("obra");
    data.forEach(obras =>{
        let option = document.createElement("option");
        option.value = obras.id;
        option.textContent = obras.nome;
        selectObra.appendChild(option.cloneNode(true));
    });
}

async function carregarCaminhoes() {
    const {data, error} = await supabase
        .from("caminhoes")
        .select("*");
    if (error) {
        console.error("Erro ao carregar caminhões." + error);
        return;
    }

    let selectCaminhaoSv = document.getElementById("caminhaoSv");
    let selectCaminhaoAb = document.getElementById("caminhaoAb");
    data.forEach(c => {
        let option = document.createElement("option")
        option.value = c.id;
        option.textContent = c.nome;
        selectCaminhaoSv.appendChild(option.cloneNode(true));
        selectCaminhaoAb.appendChild(option);
    });
}

async function carregarEmpresas(){
    const {data, error} = await supabase.from("empresas").select("*");
    if (error){
        console.error("Erro ao carregar empresas:", error);
        return;
    }

    let selectEmpresaOb = document.getElementById("empresaOb");
    let selectEmpresaAb = document.getElementById("empresaAb");
    data.forEach(empresa =>{
        let option = document.createElement("option");
        option.value = empresa.id;
        option.textContent = empresa.nome;
        selectEmpresaOb.appendChild(option.cloneNode(true));
        selectEmpresaAb.appendChild(option);
    });
}

/*Adicionar serviços*/
async function adicionarServico(event) {
    event.preventDefault();

    const qtd = document.getElementById("qtd").value;
    const peso = document.getElementById("peso").value || null;
    const data_at = document.getElementById("dataSv").value
    const obra_id = document.getElementById("obra").value;
    const caminhao_id = document.getElementById("caminhaoSv").value;

    const{data, error} = await supabase
        .from("servicos")
        .insert([{id_obra:obra_id, id_caminhao:caminhao_id, data: data_at, quantidade_carrada: qtd, peso: peso}]);
    
    if (error){
        alert("Erro ao adicionar servico: " + error.message);
    } else{
        alert("Serviço adicionado com sucesso!")
        document.getElementById("formServico").reset();
        listarServicos();
    }
}

/*Adicionar Abastecimento*/
async function adicionarAbastecimento(event) {
    event.preventDefault();

    const valor_total = document.getElementById("valor_totalAbastecimento").value;
    const litros = document.getElementById("litroAbastecimento").value || null;
    const data_ab = document.getElementById("dataAb").value
    const empresa_id = document.getElementById("empresaAb").value;
    const caminhao_id = document.getElementById("caminhaoAb").value;

    const{data, error} = await supabase
        .from("abastecimento")
        .insert([{valor_total: valor_total, litros:litros, data: data_ab, id_empresa: empresa_id, id_caminhao: caminhao_id}]);
    
    if (error){
        alert("Erro ao adicionar abastecimento: " + error.message);
    } else{
        alert("Abastecimento adicionado com sucesso!")
        document.getElementById("formAbastecimento").reset();
        listarAbastecimentos();
    }
}

/*Adicionar Obras*/
async function adicionarObra(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const empresa_id = document.getElementById("empresaOb").value;
    const preco_fixo = document.getElementById("preco_fixo").checked;
    const valor_km = document.getElementById("valor_km").value || null;
    const km_distancia = document.getElementById("km_distancia").value || null;
    const valor_total = document.getElementById("valor_total").value || null;

    const {data, error} = await supabase
        .from("obras")
        .insert([{nome: nome, id_empresa: empresa_id, preco_fixo: preco_fixo, valor_km: valor_km, km_distancia: km_distancia, valor_total: valor_total}]);

    if (error){
        alert("Erro ao adicionar abastecimento: " + error.message);
    } else {
        alert("Obra adicionada com sucesso!")
        document.getElementById("formObra").reset();
        listarObras();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarObras();
    carregarCaminhoes();
    carregarEmpresas();

    const menuToggle = document.getElementById("menu-toggle");
    const hamburger = document.getElementById("hamburger");
    const container = document.querySelector(".container");

    if (menuToggle && hamburger) {
        menuToggle.addEventListener("click", () => {
            hamburger.classList.toggle("show");
            container.classList.toggle("shift");
        });
    }
});