import { Router, Request, Response } from 'express';

const router = Router();

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Nexa Capital Platform API Documentation',
    version: '1.2.0',
    description: 'Dokumentasi resmi API platform Nexa Capital untuk otentikasi JWT, manajemen Wallet, transaksi Fast Yield, laporan eksekutif, dan NexaAI.',
    contact: {
      name: 'Nexa Capital Engineering Team',
      email: 'dev@nexacapital.id',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Production / Local Container Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Pendaftaran Akun Baru',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'investor@nexacapital.id' },
                  password: { type: 'string', example: 'Password123!' },
                  fullName: { type: 'string', example: 'Ahmad Investor' },
                  phone: { type: 'string', example: '081234567890' },
                  referralCodeUsed: { type: 'string', example: 'REF-NEXA123' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Akun berhasil dibuat.' },
          400: { description: 'Email sudah terdaftar atau input tidak valid.' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Masuk Akun (JWT Token)',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'investor@nexacapital.id' },
                  password: { type: 'string', example: 'Password123!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login berhasil, mengembalikan token JWT.' },
          401: { description: 'Kredensial tidak cocok atau akun dikunci.' },
        },
      },
    },
    '/analytics/executive': {
      get: {
        summary: 'Dasbor Analytics & Kinerja Platform',
        tags: ['Analytics'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Data analitik eksekutif real-time.' },
        },
      },
    },
    '/reports': {
      get: {
        summary: 'Daftar Laporan Tersimpan',
        tags: ['Reports'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Daftar laporan keuangan dan eksekutif.' },
        },
      },
    },
    '/ai/chat': {
      post: {
        summary: 'Tanya Jawab Asisten NexaAI',
        tags: ['NexaAI'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  prompt: { type: 'string', example: 'Bagaimana cara kerja dividen harian?' },
                  conversationId: { type: 'string', example: 'conv-123456' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Balasan edukasi dari NexaAI.' },
        },
      },
    },
    '/system/status': {
      get: {
        summary: 'Status Server & Health Check',
        tags: ['System'],
        responses: {
          200: { description: 'Status memori, database, uptime, dan socket connection.' },
        },
      },
    },
  },
};

// GET /api/docs (OpenAPI JSON Specification)
router.get('/json', (req: Request, res: Response) => {
  return res.status(200).json(openApiSpec);
});

// GET /api/docs (Interactive Swagger UI View)
router.get('/', (req: Request, res: Response) => {
  const html = `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <title>API Documentation — Nexa Capital</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css" />
    <style>
      body { margin: 0; background-color: #0f172a; }
      .swagger-ui { background-color: #0f172a; color: #f8fafc; }
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #0d9488; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js"></script>
    <script>
      window.onload = function() {
        SwaggerUIBundle({
          url: "/api/docs/json",
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset
          ]
        });
      }
    </script>
  </body>
  </html>
  `;
  return res.send(html);
});

export default router;
