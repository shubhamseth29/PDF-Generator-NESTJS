const timeSeriesPortlet = {
  templateFolderName: 'timeseries-portlet',

  script: (data) => {
    return `
            (async () => {
                let showGraph;
                let chart;
                let categoryAxis;
                let valueAxis;
                let seriesList;
                let series;
                let bullet;
                let data = ${JSON.stringify(data)};

                if (data['checkDescription'] && data['checkDescription']['description']) {
                    $('.description-container').css({'display': 'block'});
                    $('.description-content').html(data['checkDescription']['description']);
                    $('.time-series-container').css({'margin-top': '0'});
                    $('.extra-message').css({'margin-top': '20px'});
                }
                const dateRange = '(' + data['startDate'] + ' - ' + data['endDate'] + ')';
                $('.time-series-title').attr('id',data['cloud'] + data['module'] + data['page'] + data['insight'] + 'insightText');   
                $('.time-series-chart-div').attr('id',data['cloud'] + data['module'] + data['page'] + data['insight']);   
                $('.time-series-table-container').attr('id',data['cloud'] + data['module'] + data['page'] + data['insight'] + 'table');   
                $('.time-series-legendDivLine').attr('id', data['cloud'] + data['module'] + data['page'] + data['insight'] + 'legenddiv');   

                // am4core.useTheme(am4themes_dark);
                // am4core.useTheme(am4themes_animated);

                $('#' + data['cloud'] + data['module'] + data['page'] + data['insight'] + 'insightText').html(data['insightText']);

                if (Object.keys(data['dataMap']).length === 0) {
                    $('.extra-message').css({'display': 'block'});
                    $('.time-series-container').css({'display': 'none'});
                    $('.time-series-table-container').css({'display': 'none'});
                    return;
                } else if (data['dataMap'][data['dataMap']['graphKeyToBeUsed']].length > 64 || data['dataMap']['keys'].length > 70) {
                    $('.time-series-container').css({'display': 'none'});
                    showGraph = false;
                } else {
                    showGraph = true;           
                    // Create chart instance
                    chart = am4core.create(data['cloud'] + data['module'] + data['page'] + data['insight'], am4charts.XYChart);

                    chart.data = data['dataMap'][data['dataMap']['graphKeyToBeUsed']];
                    chart.dateFormatter.dateFormat = 'JJ:NN, DD MMMM';
                    chart.hideCredits = true;
                    chart.paddingRight = 40;
                    chart.marginTop = 7;

                    // Create axes
                    categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.dataFields.category = 'Date';
                    categoryAxis.title.text = 'Date ' + dateRange;
                    categoryAxis.title.fontSize = 13;
                    categoryAxis.title.fontWeight = 'bold';
                    categoryAxis.renderer.minGridDistance = 30;
                    categoryAxis.renderer.grid.template.location = 0.5;

                    // Setting up label rotation
                    categoryAxis.renderer.labels.template.rotation = 90;
                    categoryAxis.renderer.labels.template.horizontalCenter = 'left';
                    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
                    categoryAxis.renderer.labels.template.fontSize = 10;

                    valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                    valueAxis.title.text = data['dataMap']['graphKeyToBeUsed'];
                    valueAxis.title.fontSize = 13;
                    valueAxis.title.fontWeight = 'bold';
                    valueAxis.renderer.labels.template.fontSize = 13;

                    seriesList = [];
                    data['dataMap']['keys'].forEach((val, index) => {
                    series = chart.series.push(new am4charts.LineSeries());
                    series.dataFields.valueY = val;
                    series.dataFields.categoryX = 'Date';
                    series.name = val;
                    series.tooltip.getFillFromObject = false;
                    series.tooltip.getStrokeFromObject = true;
                    series.tooltip.background.fill = am4core.color('white');
                    series.tooltip.autoTextColor = false;
                    series.tooltip.label.fill = am4core.color('black');
                    series.tooltip.label.fontSize = 11;
                    series.strokeWidth = 1.5;
                    bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.stroke = am4core.color('#fff');
                    bullet.circle.strokeWidth = 1;
                    bullet.circle.radius = 3;
                    series.bullets.getIndex(0).tooltipText = '{name}:[b]{valueY}';
                    series.legendSettings.itemValueText = '{valueY}';
                    seriesList.push(series);
                    });

                    chart.legend = new am4charts.Legend();
                    legendContainer = am4core.create(data['cloud'] + data['module'] + data['page'] + data['insight'] + 'legenddiv', am4core.Container);
                    legendContainer.width = am4core.percent(100);
                    //legendContainer.height = am4core.percent(100);
                    chart.legend.parent = legendContainer;
                    chart.legend.labels.template.maxWidth = 150;
                    chart.legend.labels.template.truncate = false;
                    chart.legend.labels.template.wrap = true;

                    chart.events.on('datavalidated', resizeLegend);
                    chart.events.on('maxsizechanged', resizeLegend);
                    function resizeLegend(ev) {
                        setTimeout(() => {
                            document.getElementById(data['cloud'] + data['module'] + data['page'] + data['insight'] + 'legenddiv').style.height = chart.legend.contentHeight + 40 + 'px';
                        }, 10);
                    }

                    chart.legend.useDefaultMarker = true;
                    markerTemplate = chart.legend.markers.template;
                    markerTemplate.width = 15;
                    markerTemplate.height = 15;
                    chart.legend.fontSize = '11';
                    marker = chart.legend.markers.template.children.getIndex(0);
                    marker.cornerRadius(12, 12, 12, 12);
                    marker.radius = 5.5;
                    marker.stroke = am4core.color('#ccc');
                }
                setTimeout(() => {
                    if (showGraph) {
                        document.getElementById(data['cloud'] + data['module'] + data['page'] + data['insight'] + 'legenddiv').style.height = chart.legend.contentHeight + 40 + 'px';
                    }
                   
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
                    $('#' + data['cloud'] + data['module'] + data['page'] + data['insight'] + 'table').html(htmlForTable);
                }, 3000);
            })();
        `;
  },
};

export default timeSeriesPortlet;