import { client } from '../config/database.js';

const speedtestController = {
  // Получить все результаты тестов
  async getResults(req, res) {
    try {
      const { limit = 100, offset = 0 } = req.query;
      
      const query = `
          SELECT 
              id,
              created_at,
              download_speed,
              upload_speed,
              ping,
              jitter,
              download_data_mb,
              upload_data_mb,
              user_agent,
              ip_address,
              hostname,
              server_ip,
              data_sent_bytes,
              data_received_bytes
          FROM speed_test_results 
          ORDER BY created_at DESC
          LIMIT $1 OFFSET $2
      `;
      
      const countQuery = `SELECT COUNT(*) FROM speed_test_results`;
      const result = await client.query(query, [limit, offset]);
      const countResult = await client.query(countQuery);
      const total = countResult.rows[0].count;
      
      res.json({
          success: true,
          results: result.rows,
          total
      });
      
    } catch (error) {
      console.error('Error fetching results:', error);
      res.status(500).json({
          success: false,
          error: 'Failed to fetch results'
      });
    }
  },

  // Сохранить результат теста скорости
  async saveResult(req, res) {
    try {
      // Получаем данные из разных возможных форматов
      let {
          d, u, p, j, dd, ud, ua,
          downloadSpeed, uploadSpeed, ping, jitter,
          downloadData, uploadData, userAgent,
          server_ip, hostname
      } = req.body;

      // Преобразуем в общие переменные
      const download_speed = parseFloat(d || downloadSpeed) || 0;
      const upload_speed = parseFloat(u || uploadSpeed) || 0;
      const ping_value = parseInt(p || ping) || 0;
      const jitter_value = parseInt(j || jitter) || 0;
      const download_data_mb = parseFloat(dd || downloadData) || 0;
      const upload_data_mb = parseFloat(ud || uploadData) || 0;
      const user_agent = ua || userAgent || req.headers['user-agent'] || '';
      
      // Получаем IP клиента
      const ip_address = req.headers['x-forwarded-for'] || 
                        req.headers['x-real-ip'] || 
                        req.socket.remoteAddress || 
                        '';
      
      // Если hostname не передан, берем из запроса
      hostname = hostname || req.hostname;
      
      // Рассчитываем байты из мегабайт
      const data_sent_bytes = Math.round(upload_data_mb * 1048576);
      const data_received_bytes = Math.round(download_data_mb * 1048576);

      const query = `
          INSERT INTO speed_test_results (
              download_speed,
              upload_speed,
              ping,
              jitter,
              download_data_mb,
              upload_data_mb,
              user_agent,
              ip_address,
              hostname,
              server_ip,
              data_sent_bytes,
              data_received_bytes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING id, created_at
      `;

      const values = [
          download_speed,
          upload_speed,
          ping_value,
          jitter_value,
          download_data_mb,
          upload_data_mb,
          user_agent,
          ip_address.split(',')[0].trim(), // Берем первый IP если список
          hostname,
          server_ip || null,
          data_sent_bytes,
          data_received_bytes
      ];

      const result = await client.query(query, values);
      
      res.json({
          success: true,
          message: 'Speed test results saved successfully',
          data: {
              id: result.rows[0].id,
              created_at: result.rows[0].created_at,
              metrics: {
                  download_speed,
                  upload_speed,
                  ping: ping_value,
                  jitter: jitter_value,
                  download_data_mb,
                  upload_data_mb
              }
          }
      });
    } catch (error) {
      console.error('Error saving speed test results:', error);
      res.status(500).json({
          success: false,
          error: 'Failed to save results'
      });
    }
  },

  // Получить статистику по результатам
  async getStats(req, res) {
    try {
      const query = `
          SELECT 
              COUNT(*) as total_tests,
              AVG(download_speed) as avg_download,
              AVG(upload_speed) as avg_upload,
              AVG(ping) as avg_ping,
              AVG(jitter) as avg_jitter,
              MIN(download_speed) as min_download,
              MAX(download_speed) as max_download,
              MIN(upload_speed) as min_upload,
              MAX(upload_speed) as max_upload,
              MIN(created_at) as first_test,
              MAX(created_at) as last_test
          FROM speed_test_results
      `;
      
      const result = await client.query(query);
      
      res.json({
          success: true,
          data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
          success: false,
          error: 'Failed to fetch statistics'
      });
    }
  }
};

export default speedtestController;