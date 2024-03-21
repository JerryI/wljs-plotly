BeginPackage["Notebook`Kernel`PlotlyExtension`", {
	"JerryI`Misc`Events`",
	"Notebook`Editor`Kernel`FrontSubmitService`",
    "Notebook`Editor`FrontendObject`",
    "Notebook`Editor`Kernel`FrontSubmitService`MetaMarkers`"
}]

Plotly::usage = "Plotly[expr_, {var_, min_, max_}] or Plotly[{a__Association}, opts] _PlotlyInstance plots an expr using Plotly.js library"
PlotlyInstance::usage = "Internal representation of Plotly instance"

Plotly`addTraces::usage = "Plotly`addTraces[p_PlotlyInstance, traces_List] appends new traces"
Plotly`deleteTraces::usage = ""
Plotly`extendTraces::usage = ""
Plotly`prependTraces::usage = ""
Plotly`animate::usage = ""

PlotlyAddTraces::usage = "Plotly`addTraces[p_PlotlyInstance, traces_List] appends new traces"
PlotlyDeleteTraces::usage = ""
PlotlyExtendTraces::usage = ""
PlotlyPrependTraces::usage = ""
PlotlyAnimate::usage = ""

ListPlotly::usage = "ListPlotly plots a list of expressions using Plotly.js library"
ListLinePlotly::usage = "ListLinePlotly plots a list of expressions using Plotly.js library. Supports dynamic updates"

Begin["`Private`"]

Plotly[f_, range_List, op : OptionsPattern[Plot] ] := Plot[f, range, op] // Cases[#, Line[x_] :> x, All] & // ListLinePlotly[#, op] & ;

Plotly[a_Association] := Plotly @@ Join[{{a}}, Options[Plotly] ]
Plotly[a_List] := Plotly @@ Join[{a}, Options[Plotly] ]
Plotly[a_Association, opts__Rule ] := Plotly[{a}, opts]
Plotly[a_List, opts__Rule ] := With[{uid = CreateUUID[]},
    PlotlyInstance[uid, <|"Data"->a, "Layout"->Join[Association[Options[Plotly] ], Association[List[opts] ] ]|>, CurrentWindow[] ]
]

Options[Plotly] = {"margin"-><|
    "l"->30,
    "r"->30,
    "b"->30,
    "t"->30,
    "pad"->4 
|>, "width"->400, "height"->300};

PlotlyInstance /: MakeBoxes[PlotlyInstance[uid_String, data_, _] , StandardForm] := With[{o = CreateFrontEndObject[{Plotly`newPlot[data["Data"], data["Layout"] ], MetaMarker[uid]}]},
    MakeBoxes[o, StandardForm]
]


PlotlyInstance /: Plotly`addTraces[ PlotlyInstance[uid_, _, win_], traces_ ] := FrontSubmit[Plotly`addTraces[traces], MetaMarker[uid], "Window"->win]
PlotlyInstance /: Plotly`deleteTraces[ PlotlyInstance[uid_, _, win_], traces_ ] := FrontSubmit[Plotly`deleteTraces[traces], MetaMarker[uid], "Window"->win ]
PlotlyInstance /: Plotly`extendTraces[ PlotlyInstance[uid_, _, win_], traces_, arr_ ] := FrontSubmit[Plotly`extendTraces[traces, arr], MetaMarker[uid], "Window"->win ]
PlotlyInstance /: Plotly`prependTraces[ PlotlyInstance[uid_, _, win_], traces_, arr_ ] := FrontSubmit[Plotly`prependTraces[traces, arr], MetaMarker[uid], "Window"->win ]

PlotlyInstance /: Plotly`animate[ PlotlyInstance[uid_, _, win_], traces_, arr_ ] := FrontSubmit[Plotly`animate[traces, arr], MetaMarker[uid], "Window"->win ]

ListLinePlotly /: MakeBoxes[ListLinePlotly[args__], StandardForm] := With[{o = CreateFrontEndObject[ListLinePlotly[args]]}, MakeBoxes[o, StandardForm]]
ListPlotly /: MakeBoxes[ListPlotly[args__], StandardForm] := With[{o = CreateFrontEndObject[ListPlotly[args]]}, MakeBoxes[o, StandardForm]]

PlotlyAddTraces = Plotly`addTraces
PlotlyDeleteTraces = Plotly`deleteTraces
PlotlyExtendTraces = Plotly`extendTraces
PlotlyPrependTraces = Plotly`prependTraces
PlotlyAnimate = Plotly`animate

End[]
EndPackage[]