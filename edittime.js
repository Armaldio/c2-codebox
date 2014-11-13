function GetPluginSettings()
{
	return {
		"name":			"Code box",
		"id":			"codebox",
		"version":		"1.0",
		"description":	"An input box with some code features",
		"author":		"Armaldio",
		"help url":		"http://www.scirra.com/manual/117/textbox",
		"category":		"Form controls",
		"type":			"world",			// appears in layout
		"rotatable":	false,
		"flags":		pf_position_aces | pf_size_aces,
		"dependency":   "ace.js;theme-monokai.js;theme-chaos.js;theme-terminal.js;mode-javascript.js;worker-javascript.js;mode-c_cpp.js;mode-csharp.js;mode-vbscript.js;mode-css.js;mode-html.js;mode-php.js;mode-plain_text.js;mode-snippets.js;mode-sql.js"
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
AddCondition(0, cf_trigger, "On text changed", "code box", "On text changed", "Triggered when the text in the code box changes.", "OnTextChanged");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("Text", "The text to set in the code box.");
AddAction(0, af_none, "Set text", "code box", "Set text to {0}", "Set the code box's text.", "SetText");

AddStringParam("Tooltip", "The tooltip to set on the code box.");
AddAction(2, af_none, "Set tooltip", "code box", "Set tooltip to {0}", "Set the code box's tooltip.", "SetTooltip");

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the code box.");
AddAction(3, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the code box.", "SetVisible");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Mode", "Choose whether to enable or disable the code box.");
AddAction(4, af_none, "Set enabled", "code box", "Set <b>{0}</b>", "Disable or enable the code box.", "SetEnabled");

AddComboParamOption("Read-only");
AddComboParamOption("Not read-only");
AddComboParam("Mode", "Choose whether to enable or disable read-only mode.");
AddAction(5, af_none, "Set read-only", "code box", "Set <b>{0}</b>", "Turn read-only on or off.", "SetReadOnly");

AddAction(6, af_none, "Set focused", "code box", "Set focused", "Set the input focus to the code box.", "SetFocus");

AddAction(8, af_none, "Set unfocused", "code box", "Set unfocused", "Remove the input focus from the code box.", "SetBlur");

AddAction(9, af_none, "Scroll to bottom", "code box", "Scroll to bottom", "Scroll to the bottom of the code box", "ScrollToBottom");

//Change editor theme
AddComboParamOption("Monokai");
AddComboParamOption("Chaos");
AddComboParamOption("Terminal");
AddComboParam("Theme", "Choose a theme : ");
AddAction(10, af_none, "Set editor theme", "codebox", "Set editor theme to {0}", "Set the theme of the editor", "SetEditorTheme");

//Change editor language
AddComboParamOption("Javascript");
AddComboParamOption("C/C++");
AddComboParamOption("C#");
AddComboParam("Language", "Choose a language : ");
AddAction(11, af_none, "Set editor language", "codebox", "Set editor language to {0}", "Set the language of the editor", "SetEditorLang");

AddAction(12, af_none, "Insert text at cursor", "codebox", "Insert text at cursor", "Insert text at cursor", "InsertTextAtCursor");

AddNumberParam("Line", "The line number where to go");
AddAction(13, af_none, "Go to a line", "codebox", "Go to line {0}", "Go to a line", "GoToALine");

AddNumberParam("Size", "The size of the font");
AddAction(14, af_none, "Set font size", "codebox", "Set font size", "Set font size", "setfontSize");

AddAction(15, af_none, "Load editor", "codebox", "Load editor", "Load editor", "LoadEditor");
////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "Get text", "code box", "Text", "Get the code box's text.");
AddExpression(1, ef_return_string, "Get selected text", "codebox", "SelectedText", "Get selected text");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,	"Text",					"",			"The initial text for the code box."),
	new cr.Property(ept_text,	"Tooltip",				"",			"Display this text when hovering the mouse over the control."),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the code box is visible on startup.", "Invisible|Visible"),
	new cr.Property(ept_combo,	"Enabled",				"Yes",		"Choose whether the code box is enabled or disabled on startup.", "No|Yes"),
	new cr.Property(ept_combo,	"Read-only",			"No",		"Choose whether the code box is read-only on startup.", "No|Yes"),
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	//var editor = ace.edit('editor');
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	this.just_inserted = false;
	this.font = null;
}

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(150, 22));
}

IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);
		
	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	renderer.Fill(quad, this.properties["Enabled"] === "Yes" ? cr.RGB(255, 255, 255) : cr.RGB(224, 224, 224));
	renderer.Outline(quad, cr.RGB(0, 0, 0));
	
	cr.quad.prototype.offset.call(quad, 4, 2);
	
	if (this.properties["Text"].length)
	{
		this.font.DrawText(this.properties["Text"],
							quad,
							cr.RGB(0, 0, 0),
							ha_left);
	}
	else
	{
		this.font.DrawText(this.properties["Placeholder"],
							quad,
							cr.RGB(128, 128, 128),
							ha_left);
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}