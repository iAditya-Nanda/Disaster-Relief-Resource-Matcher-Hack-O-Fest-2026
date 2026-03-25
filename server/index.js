require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');


// Controllers & Routes
const resourceRoutes = require('./routes/resourceRoutes');
const needRoutes = require('./routes/needsRoutes');
const matchRoutes = require('./routes/matchRoutes');
const aiRoutes = require('./routes/aiRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// 1. Security & Middleware
app.use(cors());
app.use(express.json());



// 2. Supabase Setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// 3. Health & Status
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    service: 'Himachal-Sahayata-Backend'
  });
});

// 4. API Routes
app.use('/api/shared', logisticsRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/needs', needRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/volunteers', volunteerRoutes);

// 5. Chat History (Modularizing later)
app.get('/api/messages/:room', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles(full_name, role)')
    .eq('room_id', req.params.room)
    .order('created_at', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// --- SOCKET.IO HANDLING (Phase 3) ---
io.on('connection', (socket) => {
  socket.on('join_personal', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('join_incident', (incidentId) => {
    socket.join(incidentId);
  });

  socket.on('send_message', async (data) => {
    const { room, sender_id, text } = data;
    const { error } = await supabase.from('messages').insert([{ room_id: room, sender_id, text }]);
    if (!error) io.to(room).emit('receive_message', data);
  });

  // WebRTC Signaling
  socket.on('video_offer', (data) => socket.to(`user_${data.targetUserId}`).emit('video_offer', { callerSocketId: socket.id, offer: data.offer }));
  socket.on('video_answer', (data) => socket.to(`user_${data.targetUserId}`).emit('video_answer', { answer: data.answer }));
  socket.on('ice_candidate', (data) => socket.to(`user_${data.targetUserId}`).emit('ice_candidate', { candidate: data.candidate }));
});

// 6. Global Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err.stack);
  res.status(500).json({ error: 'Critical system error occurred.' });
});

server.listen(PORT, () => {
  console.log(`🚀 Himachal-Sahayata Backend READY on Port ${PORT}`);
  console.log(`🛠️ Mode: ${process.env.NODE_ENV || 'Development'}`);
});
