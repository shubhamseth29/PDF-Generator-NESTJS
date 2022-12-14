const timeSeriesPortlet = {
  templateFolderName: 'timeseries-portlet',

  script: (data) => {
    return `
    (async () => {
        let data = ${JSON.stringify(data)};
        let tableData = data.dataMap.table;
        let tableKeys = data.dataMap.tableKeys;
        let chart;
     
        setTimeout(() => { 
          $('#title').html(data['insightText']);
  
          if (tableData && tableData.length === 0) {
            $('.extra-message').css({'display': 'block'});
            $('.table-container').css({'display': 'none'});
            $('.chart-container').css({'display': 'none'});
          }
  
         // Code for generating Chart
  
         if (tableData && tableData.length && tableKeys && tableKeys.length) {
          $('.extra-message').css({'display': 'hidden'});
  
          const chartDataObjectArray = [];
          const chartObj = {
            category: tableKeys[0],
          };
          tableData.push({
            [tableKeys[1]]: data.dataMap.totalCost,
            [tableKeys[0]]: 'Total',
        });
          tableData.map((each) => {
            if (each[tableKeys[0]] !== 'Total') {
              if (chartObj[each[tableKeys[0]]]) {
                chartObj[each[tableKeys[0]]] =
                    Number(chartObj[each[tableKeys[0]]]) +
                    Number(each[tableKeys[1]]);
            } else {
                chartObj[each[tableKeys[0]]] = Number(
                    each[tableKeys[1]]
                );
            }
            }
          });
     
          chartDataObjectArray.push(chartObj);
     
          chart = am4core.create(
            'chart-div',
            am4charts.XYChart
          );
     
          chart.data = chartDataObjectArray;
     
          let categoryAxis = chart.yAxes.push(new am4charts.ValueAxis());
     
          categoryAxis.renderer.grid.template.opacity = 0;
          categoryAxis.renderer.labels.template.fontSize = 10;
          let valueAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          valueAxis.dataFields.category = 'category';
     
          chart.legend = new am4charts.Legend();
          chart.legend.labels.template.truncate = false;
          chart.legend.labels.template.wrap = true;
          chart.legend.useDefaultMarker = true;
          let markerTemplate = chart.legend.markers.template;
          markerTemplate.width = 15;
          markerTemplate.height = 15;
          chart.legend.fontSize = '14';
          let marker = chart.legend.markers.template.children.getIndex(
            0
          );
          marker.radius = 5.5;
          marker.stroke = am4core.color('#ccc');
          chart.legend.labels.template.marginTop = 5;
     
     
          Object.keys(chartObj).forEach((each) => {
            if (each !== 'category') {
              let field = each;
              let series = chart.series.push(new am4charts.ColumnSeries());
              series.columns.template.width = am4core.percent(90);
              series.dataFields.categoryX = 'category';
              series.columns.template.tooltipText = '{name}: {valueY}';
              series.dataFields.valueY = field;
              series.stacked = true;
              series.name = field;
              series.strokeWidth = 0;
  
              series.legendSettings.labelText = '{name} ({valueY.close})';
            }
          });
     
        //   Code for generating table
     
          let htmlForTable = '<table>';
          htmlForTable += '<thead><tr>';
          data['dataMap']['tableKeys'].forEach(key => {
            htmlForTable += '<th>' + key + '</th>';
          });
          htmlForTable += '</tr></thead>';
          htmlForTable += '<tbody>'
          for (let i = 0, length = data['dataMap']['table'].length; i < length; ++i) {
            htmlForTable += '<tr>';
            data['dataMap']['tableKeys'].forEach(key => {
              if (key in data['dataMap']['table'][i]) {
                htmlForTable += '<td>' + data['dataMap']['table'][i][key] + '</td>';
              } else {
                htmlForTable += '<td>' + '-' + '</td>';
              }
            });
            htmlForTable += '</tr>';
    
          }
          htmlForTable += '</tbody>';
          htmlForTable += '</table>';
          $('#table').html(htmlForTable);
       }
        }, 2000);
      })();`;
  },
};

export default timeSeriesPortlet;
