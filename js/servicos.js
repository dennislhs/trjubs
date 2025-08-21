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
        selectObra.appendChild(option);
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

async function adicionarServico(event) {
    event.preventDefault();

    const qtd = document.getElementById("qtd").value;
    const peso = document.getElementById("peso").value;
    const data_at = document.getElementById("data").value
    const obra_id = document.getElementById("obra").value;
    const caminhao_id = document.getElementById("caminhao").value;

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

async function listarServicos(){

    const {data, error} = await supabase
        .from('servicos')
        .select(`
            *, 
            obras(nome), 
            caminhoes(nome)
        `);

    if (error){
        document.getElementById("listaServicos").innerHTML = "<p>Erro ao carregar Servicos.</p>";
    } else{
        let html =`
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Obra</th>
                        <th>Caminhão</th>
                        <th>Data</th>
                        <th>Quantidade</th>
                        <th>peso</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(c => {
            const datapd = c.data;
            const databr = new Date(datapd + 'T00:00:00').toLocaleDateString('pt-BR');

            const nomeCaminhao = c.caminhoes ? c.caminhoes.nome: 'N/A';
            const nomeObra = c.obras ? c.obras.nome: 'N/A';
            

            html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${nomeObra}</td>
                    <td>${nomeCaminhao}</td>
                    <td>${databr}</td>
                    <td>${c.quantidade_carrada}</td>
                    <td>${c.peso} T</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;
        
        document.getElementById("listaServicos").innerHTML = html;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarObras();
    carregarCaminhoes();
    listarServicos();
});