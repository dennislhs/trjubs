const supabase_url = "https://qphxpdbpeyngrunuxpjw.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHhwZGJwZXluZ3J1bnV4cGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzA0MzksImV4cCI6MjA3MTIwNjQzOX0.NMXBahgj5teLre42_rFEhWvdwIqKPxf6tHP0gCnx7Zw"

const supabase = window.supabase.createClient(supabase_url, supabase_key);

function abrirFormulario (id){
    document.getElementById(id).classList.toggle("oculto");
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

async function adicionarPeca(event) {
    event.preventDefault();

    const tipoPeca = document.getElementById("tipoPeca").value;
    const km_atual = document.getElementById("km_atual").value;
    const data_tr = document.getElementById("data").value
    const caminhao_id = document.getElementById("caminhao").value;

    const{data, error} = await supabase
        .from("manutencao")
        .insert([{tipo: tipoPeca, km_atual: km_atual, data: data_tr, id_caminhao: caminhao_id}]);
    
    if (error){
        alert("Erro ao adicionar peça: " + error.message);
    } else{
        alert("Peça adicionado com sucesso!")
        document.getElementById("formPeca").reset();
        listarPecas();
    }
}

async function listarPecas(){

    const {data, error} = await supabase
        .from('manutencao')
        .select(`
            *,
            caminhoes(nome)
        `);

    if (error){
        document.getElementById("listaPeca").innerHTML = "<p>Erro ao carregar Peças.</p>";
    } else{
        let html =`
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Caminhão</th>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Km Atual</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(c => {
            const datapd = c.data;
            const databr = new Date(datapd + 'T00:00:00').toLocaleDateString('pt-BR');

            const nomeCaminhao = c.caminhoes ? c.caminhoes.nome: 'N/A';            

            html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${nomeCaminhao}</td>
                    <td>${databr}</td>
                    <td>${c.tipo}</td>
                    <td>${c.km_atual.toFixed(3)}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;
        
        document.getElementById("listaPecas").innerHTML = html;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarCaminhoes();
    listarPecas();
});