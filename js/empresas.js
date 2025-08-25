const supabase_url = "https://qphxpdbpeyngrunuxpjw.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHhwZGJwZXluZ3J1bnV4cGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzA0MzksImV4cCI6MjA3MTIwNjQzOX0.NMXBahgj5teLre42_rFEhWvdwIqKPxf6tHP0gCnx7Zw"

const supabase = window.supabase.createClient(supabase_url, supabase_key);

function abrirFormulario(id){
    document.getElementById(id).classList.toggle("oculto")
}

async function adicionarEmpresa(event){
    event.preventDefault();

    const nome = document.getElementById("nomeEmpresa").value;
    const cnpj = document.getElementById("cnpjEmpresa").value;

    const {data, error} = await supabase
        .from("empresas")
        .insert([{nome: nome, cnpj: cnpj}]);

    if (error){
        alert("error ao adicionar empresa" + error.message);
    } else{
        alert("Empresa adicionada com sucesso!")
        document.getElementById("formEmpresa").reset();
        listarEmpresas();
    }
}

async function listarEmpresas() {
    const {data, error} = await supabase
        .from('empresas')
        .select('*');

    if (error){
        document.getElementById("listaEmpresas").innerHTML = "<p>Erro ao carregar as empresas.</p>";
    } else{
        let html =`
            <table border="1" cellpadding="1" cellspcing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CNPJ</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(c => {
            html += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.nome}</td>
                    <td>${c.cnpj? c.cnpj : "-"}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;

        document.getElementById("listaEmpresas").innerHTML = html;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    listarEmpresas();

    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    })
});