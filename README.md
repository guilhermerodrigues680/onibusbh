# Ônibus BH

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Aplicação Web para acompanhamento da previsão de chegada e itinerários dos ônibus de BH.

[Acesse aqui o Ônibus BH](http://onibusbh.guilhermeonline.com.br/)

## Configuração do projeto 

### Instalação de dependências

```
npm install
```

### Compila e configura hot-reloads para desenvolvimento

```
npm run serve
```

### Compila e minimiza para produção

```
npm run build
```

### Lints e reparo de arquivos

```
npm run lint
```

### Outras informações

- [Vue.js](https://vuejs.org/)
- [Vue CLI - Configuration Reference](https://cli.vuejs.org/config/).
- [Vuetify - Material Design Framework](https://vuetifyjs.com/en/)
- [Vue Leaflet](https://vue2-leaflet.netlify.app/)

## Conteúdo HTTP

A aplicação consome a **API do SIU Mobile** que é transmitida sobre HTTP, por esse motivo para a aplicação funcionar corretamente ela deve ser acessada com HTTP: `http://onibusbh.guilhermeonline.com.br` e não com HTTPS: `https://onibusbh.guilhermeonline.com.br`. O acesso da aplicação com HTTPS faz com o navegador bloquei as chamadas à API alegando **Conteúdo Misto**.

HTTP não é considerado seguro para trafegar informações sensíveis, porém como esta aplicação não envia ou recebe informações sigilosas o uso do HTTP é aceitável.

> Isso será corrigido em uma próxima versão criando uma API própria para essa aplicação e assim todo tráfego cliente-servidor será HTTPS.

## Versionamento

Este projeto segue o seguinte o [Versionamento Semântico 2.0.0](https://semver.org/lang/pt-BR/spec/v2.0.0.html).

<!-- ## Changelog -->
<!-- https://keepachangelog.com/en/1.0.0/ -->

## Licença

O código fonte do projeto está sob a licença **GNU General Public License v3.0**.

Cópia da **GNU General Public License**  disponível no arquivo [COPYING](./COPYING) deste projeto.

## Autor

Guilherme Rodrigues - [github.com/guilhermerodrigues680](https://github.com/guilhermerodrigues680)

## Créditos

- [brunoarmanelli/UsodaAPIdoSIU.md](https://gist.github.com/brunoarmanelli/71193578d84b929799653aa61cdb4ba9)
- [IBGE - API de serviço de dados](https://servicodados.ibge.gov.br/api/docs/malhas?versao=2)
