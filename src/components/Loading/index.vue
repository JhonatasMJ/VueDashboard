<template>
    <div class="flex flex-col justify-center items-center h-screen">
        <span class="loader"></span>
    </div>
  </template>
  
  <style scoped>
.loader {
          position: relative;
          display: flex;
        }
        .loader:before , .loader:after {
            content: '';
            width: 15px;
            height: 15px;
            display: inline-block;
            position: relative;
            margin: 0  5px  ;
            border-radius: 50%;
            color: #222;
            background: currentColor;
            box-shadow: 50px 0 ,  -50px 0;
            animation: left 1s infinite ease-in-out;
          }
          .loader:after {
            color: #FF4218;
            animation: right 1.1s infinite ease-in-out;
          }


        @keyframes right {
          0% , 100%{transform: translateY(-10px) }
          50% { transform: translateY(10px) }
        }

        @keyframes left {
          0% , 100%{ transform: translateY(10px) }
          50% { transform: translateY(-10px) }
        }
  </style>
  