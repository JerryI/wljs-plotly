Plotly[f_, range_, op : OptionsPattern[Plot]] := Plot[f, range, op] // Cases[#, Line[x_] :> x, All] & // ListLinePlotly[#, op] & ;

Options[RequestAnimationFrame] = {"event"->Null, "reply"->Null};
SetAttributes[RequestAnimationFrame, HoldRest]

ListPlotly /: RequestAnimationFrame[ListPlotly[data_], opts : OptionsPattern[]] := Module[{evid = RandomString[20]},
    If[(OptionValue["event"]//NullQ) || (OptionValue["reply"]//NullQ), Return[HTMLForm["<span style=\"color:ref\">Error!</span> Specify event and reply symbols!"], Module ] ];
    
    With[{id = evid},
        Scan[Function[s, s = EventObject[<|"id"->id, "view"->HTMLForm["- EventObject -"]|>], HoldAll], OptionValue[f, Unevaluated[{opts}], "event", Hold]];
    ];

    With[{id = evid, sym = Symbol["sym"<>evid]},
        Scan[Function[s, s := Function[Ourdata, SendToFrontEnd[ sym[Ourdata] ] ], HoldAll], OptionValue[f, Unevaluated[{opts}], "reply", Hold]];
    ];  

    ListPlotly[data, "RequestAnimationFrame"->{evid, "sym"<>evid}] 
]

ListLinePlotly /: MakeBoxes[ListLinePlotly[args__], StandardForm] := With[{o = CreateFrontEndObject[ListLinePlotly[args]]}, MakeBoxes[o, StandardForm]]
ListPlotly /: MakeBoxes[ListPlotly[args__], StandardForm] := With[{o = CreateFrontEndObject[ListPlotly[args]]}, MakeBoxes[o, StandardForm]]

(* legacy methods *)
RegisterWebObject[ListLinePlotly];
RegisterWebObject[ListPlotly];