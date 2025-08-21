const supabase_url = "https://qphxpdbpeyngrunuxpjw.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHhwZGJwZXluZ3J1bnV4cGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzA0MzksImV4cCI6MjA3MTIwNjQzOX0.NMXBahgj5teLre42_rFEhWvdwIqKPxf6tHP0gCnx7Zw"

const supabase = window.supabase.createClient(supabase_url, supabase_key);

function abrirFormulario(id){
    document.getElementById(id).classList.toggle("oculto");
}

async function carregarEmpresas() {

    const {data, error} = await supabase
        .from("empresas")
        .select("*");
    
    if (error) {
        console.error("Erro ao carregar empresas:", error);
        return;
    }

    let selectEmpresa = document.getElementById("empresa");
    data.forEach(empresa =>{
        let option = document.createElement("option");
        option.value = empresa.id;
        option.textContent = empresa.nome;
        selectEmpresa.appendChild(option);
    });
}

async function adicionarObra(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const empresa_id = document.getElementById("empresa").value;
    const preco_fixo = document.getElementById("preco_fixo").checked;
    const valor_km = document.getElementById("valor_km").value;
    const km_distancia = document.getElementById("km_distancia").value;
    const valor_total = document.getElementById("valor_total").value;

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

async function listarObras() {
    
    const {data, error} = await supabase
        .from('obras')
        .select(`*, empresas(nome)`);
    
    if (error){
        document.getElementById("listaObras").innerHTML = "<p>Erro ao carregar Obras.</p>";
    } else {
        let html = `
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Nome</th>
                        <th>Preço Fixo?</th>
                        <th>Valor do KM/T</th>
                        <th>Distancia (KM)</th>
                        <th>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(c => {
            
            const nomeEmpresa = c.empresas ? c.empresas.nome : 'N/A';
            const precoFixoTx = c.preco_fixo ? "Sim" : "Não";

            html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${nomeEmpresa}</td>
                    <td>${c.nome}</td>
                    <td>${precoFixoTx}</td>
                    <td>${c.valor_km ? Number(c.valor_km).toFixed(2):"-"}</td>
                    <td>${c.km_distancia? Number(c.km_distancia).toFixed(3):"-"}</td>
                    <td>${c.valor_total? Number(c.valor_total).toFixed(2):"-"}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;

        document.getElementById("listaObras").innerHTML = html;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarEmpresas();
    listarObras();
})