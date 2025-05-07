use std::{fs, net::SocketAddr};

use actix_files::Files;
use actix_web::{
    get, post,
    web::{self, Json},
    App, HttpResponse, HttpServer, Responder, middleware::Logger, http::header,
};
use serde::{Deserialize, Serialize};

// ——— Models ———

#[derive(Serialize)]
struct Usuario {
    id: i8,
    nome: String,
}

#[derive(Serialize)]
struct LoginResponse {
    success: bool,
}

#[derive(Deserialize)]
struct LoginPayload {
    username: String,
    password: String,
}

// ——— Handlers ———

async fn serve_spa() -> impl Responder {
    let html =
        fs::read_to_string("static/dist/index.html").expect("static/dist/index.html não encontrado");
    HttpResponse::Ok()
        .insert_header((header::CONTENT_TYPE, "text/html; charset=utf-8"))
        .body(html)
}

/// GET /json-data → devolve JSON de Usuários
#[get("/json-data")]
async fn listar_json() -> impl Responder {
    let usuarios = vec![
        Usuario { id: 1, nome: "Cleber".into() },
        Usuario { id: 2, nome: "Ana".into() },
    ];
    HttpResponse::Ok().json(usuarios)
}


#[post("/login")]
async fn login(payload: Json<LoginPayload>) -> impl Responder {
    let ok = payload.username == "admin" && payload.password == "123";
    let resp = LoginResponse { success: ok };
    if ok {
        HttpResponse::Ok().json(resp)
    } else {
        HttpResponse::Unauthorized().json(resp)
    }
}


async fn not_found() -> impl Responder {
    HttpResponse::NotFound().body("404 Not Found")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    env_logger::init();

    // Endereço de bind
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("🚀 Servindo em http://{}", addr);

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            // SPA: "/" , "/json" e "/login" servem o mesmo index.html
            .route("/",    web::get().to(serve_spa))
            .route("/json", web::get().to(serve_spa))
            .route("/login", web::get().to(serve_spa))
            // API JSON
            .service(listar_json)
            .service(login)
            // assets estáticos
            .service(
                Files::new("/static", "static/dist")
                    .use_last_modified(true)
                    .disable_content_disposition()
            )
            // fallback 404
            .default_service(web::route().to(not_found))
    })
    .bind(addr)?
    .run()
    .await
}
