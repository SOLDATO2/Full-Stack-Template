use std::{fs, net::SocketAddr};

use axum::{
    response::{Html, IntoResponse},
    routing::{get, get_service},
    Json, Router,
};
use http::StatusCode;
use serde::Serialize;
use tower_http::services::ServeDir;

#[derive(Serialize)]
struct Usuario {
    id: i8,
    nome: String,
}

// Rota API que retorna JSON puro
async fn listar_json() -> Json<Vec<Usuario>> {
    let usuarios = vec![
        Usuario { id: 1, nome: "Cleber".into() },
        Usuario { id: 2, nome: "Ana".into() },
    ];
    Json(usuarios)
}

async fn index_html() -> Html<String> {

    let html = fs::read_to_string("static/dist/index.html")
        .expect("static/dist/index.html não encontrado");
    Html(html)
}


async fn not_found(uri: axum::http::Uri) -> impl IntoResponse {
    (StatusCode::NOT_FOUND, format!("Rota não encontrada: {}", uri))
}

#[tokio::main]
async fn main() {
    let static_files = get_service(ServeDir::new("static/dist"));

    let app = Router::new()

        .route("/", get(index_html))
        .route("/json", get(index_html))
        .route("/json-data", get(listar_json))

        
        .nest_service("/static", static_files)
        .fallback(not_found);


    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("🚀 Servindo em http://{}", addr);
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}
