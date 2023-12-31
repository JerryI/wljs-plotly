  Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };
  
  Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };

  function arrDepth(arr) {
    if (arr[0].length === undefined)        return 1;
    if (arr[0][0].length === undefined)     return 2;
    if (arr[0][0][0].length === undefined)  return 3;
  } 

  function transpose(matrix) {
    let newm = structuredClone(matrix);
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < i; j++) {
   
        newm[i][j] = matrix[j][i];
        newm[j][i] = matrix[i][j];
      }
    } 
    return newm;
  } 
  let plotly = {};
  plotly.name = "WebObjects/Plotly";


  interpretate.contextExpand(plotly);

  

  plotly.ImageSize = () => 'ImageSize'
 
  plotly.ListPlotly = async function(args, env) {
      if (!plotly._Plotly) plotly._Plotly = await import('plotly.js-dist-min');
 
      env.numerical = true;
      let arr = await interpretate(args[0], {...env, context: plotly});
      let newarr = [];

      let options = {};
      if (args.length > 1) options = await core._getRules(args, env);

      console.log('options');
      console.log(options);

      switch(arrDepth(arr)) {
        case 1:
          newarr.push({y: arr, mode: 'markers'});
        break;
        case 2:
          if (arr[0].length === 2) {
            console.log('1 XY plot');
            let t = transpose(arr);
      
            newarr.push({x: t[0], y: t[1], mode: 'markers'});
          } else {
            console.log('multiple Y plot');
            arr.forEach(element => {
              newarr.push({y: element, mode: 'markers'}); 
            });
          }
        break;
        case 3:
          arr.forEach(element => {
            let t = transpose(element);
            newarr.push({x: t[0], y: t[1], mode: 'markers'}); 
          });
        break;      
      }

      plotly._Plotly.newPlot(env.element, newarr, {autosize: false, width: core.DefaultWidth, height: core.DefaultWidth*0.618034, margin: {
          l: 30,
          r: 30,
          b: 30,
          t: 30,
          pad: 4
        }});
      
      if (!('RequestAnimationFrame' in options)) return;
      
          console.log('request animation frame mode');
          const list = options.RequestAnimationFrame;
          const event = list[0];
          const symbol = list[1];
          const depth = arrDepth(arr);
          
          const request = function() {
            core.FireEvent(["'"+event+"'", 0]);
          }

          const renderer = async function(args2, env2) {
            let arr2 = await interpretate(args2[0], env2);
            let newarr2 = [];
      
            switch(depth) {
              case 1:
                newarr2.push({y: arr2});
              break;
              case 2:
                if (arr2[0].length === 2) {
                 
                  let t = transpose(arr2);
            
                  newarr2.push({x: t[0], y: t[1]});
                } else {
         
                  arr2.forEach(element => {
                    newarr2.push({y: element}); 
                  });
                }
              break;
              case 3:
                arr2.forEach(element => {
   
                   let newEl = transpose(element);
                  newarr2.push({x: newEl[0], y: newEl[1]}); 
                });
              break;      
            }

            plotly._Plotly.animate(env.element, {
              data: newarr2
            }, {
              transition: {
                duration: 30
              },
              frame: {
                duration: 0,
                redraw: false
              }
            });

            requestAnimationFrame(request);
          } 
          console.log('assigned to the symbol '+symbol);
          core[symbol] = renderer;
          request();
    }

    plotly.ListPlotly.destroy = ()=>{};
    
    plotly.ListLinePlotly = async function(args, env) {
      if (!plotly._Plotly) plotly._Plotly = await import('plotly.js-dist-min');
      console.log('listlineplot: getting the data...');
      let options = await core._getRules(args, env);


      let arr = await interpretate(args[0], {...env, numerical: true, context: plotly});
      console.log('listlineplot: got the data...');
      //console.log(arr);
      let newarr = [];

      console.log(options);
      /**
       * @type {[Number, Number]}
       */
      let ImageSize = options.ImageSize || [core.DefaultWidth, 0.618034*core.DefaultWidth];
  
      const aspectratio = options.AspectRatio || 0.618034;
  
      //if only the width is specified
      if (!(ImageSize instanceof Array)) ImageSize = [ImageSize, ImageSize*aspectratio];
  
      console.log('Image size');
      console.log(ImageSize);         

      switch(arrDepth(arr)) {
        case 1:
          newarr.push({y: arr});
        break;
        case 2:
          if (arr[0].length === 2) {
            console.log('1 XY plot');
            let t = transpose(arr);
            console.log(t);
      
            newarr.push({x: t[0], y: t[1]});
          } else {
            console.log('multiple Y plot');
            arr.forEach(element => {
              newarr.push({y: element}); 
            });
          }
        break;
        case 3:
          arr.forEach(element => {
             
             let newEl = transpose(element);
            newarr.push({x: newEl[0], y: newEl[1]}); 
          });
        break;      
      }

      plotly._Plotly.newPlot(env.element, newarr, {autosize: false, width: ImageSize[0], height: ImageSize[1], margin: {
          l: 30,
          r: 30,
          b: 30,
          t: 30,
          pad: 4
        }});  

        env.local.element = env.element;
    }   

    plotly.ListLinePlotly.update = async (args, env) => {
      env.numerical = true;
      console.log('listlineplot: update: ');
      console.log(args);
      console.log('interpretate!');
      let arr = await interpretate(args[0], env);
      console.log(arr);    

      let newarr = [];

      let minmax = {x:[0], y:[0]};

      switch(arrDepth(arr)) {
        case 1:
          newarr.push({y: arr});
          minmax.x = [0, arr.length];
          minmax.y = [arr.min(), arr.max()];

        break;
        case 2:
          if (arr[0].length === 2) {
            console.log('1 XY plot');
            let t = transpose(arr);
      
            newarr.push({x: t[0], y: t[1]});

            minmax.x = [t[0].min(), t[0].max()];
            minmax.y = [t[1].min(), t[1].max()];

          } else {
            console.log('multiple Y plot');
            arr.forEach(element => {
              newarr.push({y: element}); 
            });
          }
        break;
        case 3:
          arr.forEach(element => {
            let newEl = transpose(element);
            
            newarr.push({x: newEl[0], y: newEl[1]}); 
          });
        break;      
      }

      console.log("plotly with a new data: ");
      console.log(newarr);
      console.log("env");
      console.log(env);




      plotly._Plotly.animate(env.local.element, {
        data: newarr,
      }, {
        transition: {
          duration: 100,
          easing: 'cubic-in-out'
        },
        frame: {
          duration: 100
        }
      });     
    }
    
    plotly.ListLinePlotly.destroy = ()=>{};

