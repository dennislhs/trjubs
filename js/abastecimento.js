const supabase_url = "https://qphxpdbpeyngrunuxpjw.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHhwZGJwZXluZ3J1bnV4cGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzA0MzksImV4cCI6MjA3MTIwNjQzOX0.NMXBahgj5teLre42_rFEhWvdwIqKPxf6tHP0gCnx7Zw"

const supabase = window.supabase.createClient(supabase_url, supabase_key);

function abrirFormulario (id){
    document.getElementById(id).classList.toggle("oculto");
}

async function carregarEmpresas(){
    const {data, error} = await supabase.from("empresas").select("*");
    if (error){
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

async function carregarCaminhoes() {
    const {data, error} = await supabase
        .from("caminhoes")
        .select("*");
    if (error) {
        console.error("Erro ao carregar caminhões." + error);
        return;
    }

    let selectCaminhao = document.getElementById("caminhao");
    data.forEach(c => {
        let option = document.createElement("option")
        option.value = c.id;
        option.textContent = c.nome;
        selectCaminhao.appendChild(option);
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

    const {data, error} = await supabase
        .from('abastecimento')
        .select(`
            *, 
            empresas(nome), 
            caminhoes(nome)
        `);

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
            const datapd = c.data;
            const databr = new Date(datapd + 'T00:00:00').toLocaleDateString('pt-BR');

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
});