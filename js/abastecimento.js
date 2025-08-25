const supabase_url = "https://qphxpdbpeyngrunuxpjw.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHhwZGJwZXluZ3J1bnV4cGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzA0MzksImV4cCI6MjA3MTIwNjQzOX0.NMXBahgj5teLre42_rFEhWvdwIqKPxf6tHP0gCnx7Zw"

const supabase = window.supabase.createClient(supabase_url, supabase_key);

function abrirFormulario (id){
    document.getElementById(id).classList.toggle("oculto");
}

async function carregarEmpresas(){
    const {data, error} = await supabase
        .from("empresas")
        .select("*");
    if (error){
        console.error("Erro ao carregar empresas:", error);
        return;
    }

    let selectEmpresa = document.getElementById("empresa");
    let filtroEmpresa = document.getElementById("filtroEmpresa");

    data.forEach(empresa =>{

        let option1 = document.createElement("option");
        option1.value = empresa.id;
        option1.textContent = empresa.nome;
        selectEmpresa.appendChild(option1);

        let option2 = document.createElement("option");
        option2.value = empresa.id;
        option2.textContent = empresa.nome;
        filtroEmpresa.appendChild(option2);

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

    let selectCaminhao = document.getElementById("caminhao");
    let filtroCaminhao = document.getElementById("filtroCaminhao");
    
    data.forEach(c => {

        let option1 = document.createElement("option");
        option1.value = c.id;
        option1.textContent = c.nome;
        selectCaminhao.appendChild(option1);

        let option2 = document.createElement("option");
        option2.value = c.id;
        option2.textContent = c.nome;
        filtroCaminhao.appendChild(option2);

    });
}

async function adicionarAbastecimento(event) {
    event.preventDefault();

    const valor_total = document.getElementById("valor_totalAbastecimento").value;
    const litros = document.getElementById("litroAbastecimento").value;
    const data_ab = document.getElementById("data").value
    const empresa_id = document.getElementById("empresa").value;
    const caminhao_id = document.getElementById("caminhao").value;

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

async function listarAbastecimentos(){

    const filtroCaminhao = document.getElementById("filtroCaminhao").value;
    const filtroEmpresa = document.getElementById("filtroEmpresa").value;
    const dataIn = document.getElementById("dataIn").value;
    const dataFn = document.getElementById("dataFn").value;

    let query = supabase
        .from("abastecimento")
        .select(`*,
            caminhoes(nome),
            empresas(nome)`);

    if (filtroEmpresa) {
        query = query.eq('id_empresa', filtroEmpresa);
    }

    if (filtroCaminhao) {
        query = query.eq('id_caminhao', filtroCaminhao);
    }

    if (dataIn){
        query = query.gte('data', dataIn);
    }

    if (dataFn){
        query = query.lte('data', dataFn);
    }

    const {data, error} = await query

    if (error){
        document.getElementById("listaAbastecimentos").innerHTML = "<p>Erro ao carregar abastecimentos.</p>";
    } else{
        let html =`
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Caminhão</th>
                        <th>Data</th>
                        <th>Valor</th>
                        <th>Litros</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(c => {
            const databr = new Date(c.data + 'T00:00:00').toLocaleDateString('pt-BR');

            const nomeCaminhao = c.caminhoes ? c.caminhoes.nome: 'N/A';
            const nomeEmpresa = c.empresas ? c.empresas.nome: 'N/A';
            

            html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${nomeEmpresa}</td>
                    <td>${nomeCaminhao}</td>
                    <td>${databr}</td>
                    <td>R$ ${c.valor_total.toFixed(2)}</td>
                    <td>${c.litros.toFixed(3)} L</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;
        
        document.getElementById("listaAbastecimentos").innerHTML = html;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarEmpresas();
    carregarCaminhoes();
    listarAbastecimentos();

    const fe = document.getElementById("filtroEmpresa");
    const fc = document.getElementById("filtroCaminhao");
    const di = document.getElementById("dataIn");
    const df = document.getElementById("dataFn");
    if (fe) fe.addEventListener("change", listarAbastecimentos);
    if (fc) fc.addEventListener("change", listarAbastecimentos);
    if (di) di.addEventListener("change", listarAbastecimentos);
    if (df) df.addEventListener("change", listarAbastecimentos);

    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    })
});