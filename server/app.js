require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http"); // Add this line
const socketIO = require("socket.io");
const authRouter = require("./routes/authentication");
const docRouter = require("./routes/documentRoutes");
const searchRouter = require("./routes/searchRoutes");
const teamRouter = require("./routes/teamRoutes");
const textDocument = require("./model/textDocumentSchema");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await textDocument.findByIdAndUpdate(documentId, { data });
    });
  });
  console.log("a user connected");
  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  // });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  let document = await textDocument.findById(id);
  if (document) return document;

  document = await textDocument.create({ _id: id, data: defaultValue });
  return document;
}

// Middleware
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Serve static files
app.use("/files", express.static("files"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Authentication middleware
app.use("/auth", authRouter);
app.use("/docs", docRouter);
app.use("/search", searchRouter);
app.use("/teams", teamRouter);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  // Change this line
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
