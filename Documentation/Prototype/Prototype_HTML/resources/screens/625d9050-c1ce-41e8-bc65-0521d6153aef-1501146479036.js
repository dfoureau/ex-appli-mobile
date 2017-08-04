jQuery("#simulation")
  .on("click", ".s-625d9050-c1ce-41e8-bc65-0521d6153aef .click", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getEventFirer();
    if(jFirer.is("#s-Label_30")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30 span": {
                      "attributes": {
                        "color": "#FFFFFF",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_31": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_31 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_31 span": {
                      "attributes": {
                        "color": "#AFEAF2",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_32": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_32 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_32 span": {
                      "attributes": {
                        "color": "#AFEAF2",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimMove",
                  "parameter": {
                    "target": [ "#s-Line_6" ],
                    "top": {
                      "type": "movetoposition",
                      "value": "47"
                    },
                    "left": {
                      "type": "movetoposition",
                      "value": "0"
                    },
                    "containment": false,
                    "effect": {
                      "type": "none",
                      "easing": "linear",
                      "duration": 200
                    }
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        },
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/625d9050-c1ce-41e8-bc65-0521d6153aef"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Label_31")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30 span": {
                      "attributes": {
                        "color": "#AFEAF2",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_31": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_31 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_31 span": {
                      "attributes": {
                        "color": "#FFFFFF",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_32": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_32 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_32 span": {
                      "attributes": {
                        "color": "#AFEAF2",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimMove",
                  "parameter": {
                    "target": [ "#s-Line_6" ],
                    "top": {
                      "type": "movetoposition",
                      "value": "47"
                    },
                    "left": {
                      "type": "movetoposition",
                      "value": "120"
                    },
                    "containment": false,
                    "effect": {
                      "type": "none",
                      "easing": "linear",
                      "duration": 200
                    }
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        },
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/b090b0f0-7ba9-44f4-adad-d3806ce8c38c"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Label_32")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_31": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_31 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_31 span": {
                      "attributes": {
                        "color": "#AFEAF2",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30 span": {
                      "attributes": {
                        "color": "#AFEAF2",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_32": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_32 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_32 span": {
                      "attributes": {
                        "color": "#FFFFFF",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimMove",
                  "parameter": {
                    "target": [ "#s-Line_6" ],
                    "top": {
                      "type": "movetoposition",
                      "value": "47"
                    },
                    "left": {
                      "type": "movetoposition",
                      "value": "240"
                    },
                    "containment": false,
                    "effect": {
                      "type": "none",
                      "easing": "linear",
                      "duration": 200
                    }
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        },
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/23e84970-aaa2-49b2-a653-64cb60057a1c"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Text_cell_10")) {
      cases = [
        {
          "blocks": [
            {
              "condition": {
                "action": "jimEquals",
                "parameter": [ {
                  "datatype": "variable",
                  "element": "dayClicked"
                },"false" ]
              },
              "actions": [
                {
                  "action": "jimShow",
                  "parameter": {
                    "target": [ "#s-Image_81","#s-Text_2","#s-Rectangle_1","#s-Text_1","#s-Input_3","#s-Input_1","#s-Input_4","#s-Text_4","#s-Line_1","#s-Text_5" ]
                  },
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimShow",
                  "parameter": {
                    "target": [ "#s-Rectangle_2","#s-Category_2","#s-Text_3" ]
                  },
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimHide",
                  "parameter": {
                    "target": [ "#s-Line_2","#s-Input_6","#s-Text_9","#s-Text_7","#s-Rectangle_3","#s-Input_2","#s-Image_82","#s-Text_6","#s-Input_5","#s-Text_8" ]
                  },
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10": {
                      "attributes": {
                        "background-color": "#FC361D",
                        "background-image": "none"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10": {
                      "attributes-ie": {
                        "-pie-background": "#FC361D",
                        "-pie-poll": "false"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10": {
                      "attributes": {
                        "line-height": "17px",
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Bold',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10 span": {
                      "attributes": {
                        "color": "#FFFFFF",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Bold',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimSetValue",
                  "parameter": {
                    "variable": [ "dayClicked" ],
                    "value": "true"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            },
            {
              "condition": {
                "action": "jimEquals",
                "parameter": [ {
                  "datatype": "variable",
                  "element": "dayClicked"
                },"true" ]
              },
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10": {
                      "attributes": {
                        "line-height": "17px",
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Bold',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10 span": {
                      "attributes": {
                        "color": "#696CFC",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Bold',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10": {
                      "attributes": {
                        "background-color": "#FFFFFF",
                        "background-image": "none"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Text_cell_10": {
                      "attributes-ie": {
                        "-pie-background": "#FFFFFF",
                        "-pie-poll": "false"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimShow",
                  "parameter": {
                    "target": [ "#s-Line_2","#s-Input_6","#s-Text_9","#s-Text_7","#s-Rectangle_3","#s-Input_2","#s-Image_82","#s-Text_6","#s-Input_5","#s-Text_8" ]
                  },
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimHide",
                  "parameter": {
                    "target": [ "#s-Rectangle_2","#s-Category_2","#s-Text_3" ]
                  },
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimHide",
                  "parameter": {
                    "target": [ "#s-Image_81","#s-Text_2","#s-Rectangle_1","#s-Text_1","#s-Input_3","#s-Input_1","#s-Input_4","#s-Text_4","#s-Line_1","#s-Text_5" ]
                  },
                  "exectype": "serial",
                  "delay": 0
                },
                {
                  "action": "jimSetValue",
                  "parameter": {
                    "variable": [ "dayClicked" ],
                    "value": "false"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Image_81")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/3c272164-ca5e-4436-b2f5-00785cd572a9"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Image_82")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/3c272164-ca5e-4436-b2f5-00785cd572a9"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Image_46")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/3c272164-ca5e-4436-b2f5-00785cd572a9"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    } else if(jFirer.is("#s-Image_24")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimNavigation",
                  "parameter": {
                    "target": "screens/cba66832-27a6-4127-b70c-53e5385f76e9"
                  },
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    }
  })
  .on("pageload", ".s-625d9050-c1ce-41e8-bc65-0521d6153aef .pageload", function(event, data) {
    var jEvent, jFirer, cases;
    if(data === undefined) { data = event; }
    jEvent = jimEvent(event);
    jFirer = jEvent.getEventFirer();
    if(jFirer.is("#s-Label_30")) {
      cases = [
        {
          "blocks": [
            {
              "actions": [
                {
                  "action": "jimChangeStyle",
                  "parameter": [ {
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30": {
                      "attributes": {
                        "font-size": "10.0pt",
                        "font-family": "'Roboto-Regular',Arial"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30 .valign": {
                      "attributes": {
                        "vertical-align": "middle",
                        "text-align": "center"
                      }
                    }
                  },{
                    "#s-625d9050-c1ce-41e8-bc65-0521d6153aef #s-Label_30 span": {
                      "attributes": {
                        "color": "#FFFFFF",
                        "text-align": "center",
                        "text-decoration": "none",
                        "font-family": "'Roboto-Regular',Arial",
                        "font-size": "10.0pt"
                      }
                    }
                  } ],
                  "exectype": "serial",
                  "delay": 0
                }
              ]
            }
          ],
          "exectype": "serial",
          "delay": 0
        }
      ];
      event.data = data;
      jEvent.launchCases(cases);
    }
  });