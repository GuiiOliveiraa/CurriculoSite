Criei uma aplicação backend que monitora cotações de moedas e envia relatórios por e-mail.

Como funciona:
- Consulta APIs de cotação em tempo real
- Processa os dados e gera relatório em HTML formatado
- Envia e-mail automaticamente para destinatários cadastrados
- Usa variáveis de ambiente (.env) para chaves de API e credenciais

Stack: Python, SMTP, APIs externas (exchangerate e similares)

Conceitos demonstrados:
- Consumo de REST APIs
- Tratamento de erros e retry logic
- Geração dinâmica de HTML
- Envio de e-mails via SMTP
- Gestão segura de credenciais com .env
- Logging estruturado
