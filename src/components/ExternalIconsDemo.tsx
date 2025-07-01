import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";

// Компонент для демонстрации использования внешних ресурсов
const ExternalIconsDemo: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        gap: 1, 
        alignItems: "center",
        py: 1
      }}
    >
      {/* Material Icons - загружается с fonts.googleapis.com */}
      <Tooltip title="Home (Material Icons)">
        <IconButton>
          <span className="material-icons">home</span>
        </IconButton>
      </Tooltip>

      <Tooltip title="Settings (Material Icons)">
        <IconButton>
          <span className="material-icons">settings</span>
        </IconButton>
      </Tooltip>

      <Tooltip title="Search (Material Icons)">
        <IconButton>
          <span className="material-icons">search</span>
        </IconButton>
      </Tooltip>

      {/* Font Awesome Icons - загружается с cdnjs.cloudflare.com */}
      <Tooltip title="Heart (Font Awesome)">
        <IconButton>
          <i className="fas fa-heart" style={{ color: "#e91e63" }}></i>
        </IconButton>
      </Tooltip>

      <Tooltip title="Star (Font Awesome)">
        <IconButton>
          <i className="fas fa-star" style={{ color: "#ffc107" }}></i>
        </IconButton>
      </Tooltip>

      <Tooltip title="Share (Font Awesome)">
        <IconButton>
          <i className="fas fa-share" style={{ color: "#2196f3" }}></i>
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ExternalIconsDemo;
