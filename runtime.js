// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

var editor;

/////////////////////////////////////
// Plugin class
cr.plugins_.codebox = function (runtime) {
    this.runtime = runtime;
};

(function () {
    /////////////////////////////////////
    var pluginProto = cr.plugins_.codebox.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function (plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    // called on startup for each object type
    typeProto.onCreate = function () { };

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function (type) {
        this.type = type;
        this.runtime = type.runtime;
    };

    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function () {

        // Not supported in DC
        if (this.runtime.isDomFree) {
            cr.logexport("[Construct 2] Textbox plugin not supported on this platform - the object will not be created");
            return;
        }

        //Creating editor
        this.elem = document.createElement("div");
        this.elem.setAttribute("id", "editor");

        jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body")

        /*	
        		var onchangetrigger = (function (self) {
        			return function() {
        				self.runtime.trigger(cr.plugins_.TextBox.prototype.cnds.OnTextChanged, self);
        			};
        		})(this);

        		
        		this.elem["oninput"] = onchangetrigger;
        */

        this.lastLeft = 0;
        this.lastTop = 0;
        this.lastRight = 0;
        this.lastBottom = 0;
        this.lastWinWidth = 0;
        this.lastWinHeight = 0;

        this.updatePosition(true);

        this.runtime.tickMe(this);

        this.loadOnStartup = this.properties[5];
        //console.log(this.loadOnStartup);

        if (this.loadOnStartup == 1) {
            editor = ace.edit('editor');

            editor.getSession().setMode('ace/mode/javascript');
            editor.setTheme('ace/theme/monokai');
            editor.setValue(this.properties[0]);
        }
    };

    instanceProto.saveToJSON = function () {
        return {
            "text": this.elem.value,
            "placeholder": this.elem.placeholder,
            "tooltip": this.elem.title,
            "disabled": !!this.elem.disabled,
            "readonly": !!this.elem.readOnly
        };
    };

    instanceProto.loadFromJSON = function (o) {
        this.elem.value = o["text"];
        this.elem.placeholder = o["placeholder"];
        this.elem.title = o["tooltip"];
        this.elem.disabled = o["disabled"];
        this.elem.readOnly = o["readonly"];
    };

    instanceProto.onDestroy = function () {
        if (this.runtime.isDomFree)
            return;

        jQuery(this.elem).remove();
        this.elem = null;
    };

    instanceProto.tick = function () {
        this.updatePosition();
    };

    instanceProto.updatePosition = function (first) {
        if (this.runtime.isDomFree)
            return;

        var left = this.layer.layerToCanvas(this.x, this.y, true);
        var top = this.layer.layerToCanvas(this.x, this.y, false);
        var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
        var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);

        // Is entirely offscreen or invisible: hide
        if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height) {
            if (!this.element_hidden)
                jQuery(this.elem).hide();

            this.element_hidden = true;
            return;
        }

        // Truncate to canvas size
        if (left < 1)
            left = 1;
        if (top < 1)
            top = 1;
        if (right >= this.runtime.width)
            right = this.runtime.width - 1;
        if (bottom >= this.runtime.height)
            bottom = this.runtime.height - 1;

        var curWinWidth = window.innerWidth;
        var curWinHeight = window.innerHeight;

        // Avoid redundant updates
        if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight) {
            if (this.element_hidden) {
                jQuery(this.elem).show();
                this.element_hidden = false;
            }

            return;
        }

        this.lastLeft = left;
        this.lastTop = top;
        this.lastRight = right;
        this.lastBottom = bottom;
        this.lastWinWidth = curWinWidth;
        this.lastWinHeight = curWinHeight;

        if (this.element_hidden) {
            jQuery(this.elem).show();
            this.element_hidden = false;
        }

        var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
        var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
        jQuery(this.elem).css("position", "absolute");
        jQuery(this.elem).offset({
            left: offx,
            top: offy
        });
        jQuery(this.elem).width(Math.round(right - left));
        jQuery(this.elem).height(Math.round(bottom - top));

        if (this.autoFontSize)
            jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.2) + "em");
    };

    // only called if a layout object
    instanceProto.draw = function (ctx) { };

    instanceProto.drawGL = function (glw) { };

    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function (propsections) {
        propsections.push({
            "title": "codebox",
            "properties": [{
                "name": "Text",
                "value": this.elem.value
            }, {
                "name": "Placeholder",
                "value": this.elem["placeholder"]
            }, {
                "name": "Tooltip",
                "value": this.elem.title
            }, {
                "name": "Enabled",
                "value": !this.elem.disabled
            }, {
                "name": "Read-only",
                "value": !!this.elem["readOnly"]
            }, ]
        });
    };

    instanceProto.onDebugValueEdited = function (header, name, value) {
        switch (name) {
            case "Text":
                this.elem.value = value;
                break;
            case "Placeholder":
                this.elem["placeholder"] = value;
                break;
            case "Tooltip":
                this.elem.title = value;
                break;
            case "Enabled":
                this.elem.disabled = !value;
                break;
            case "Read-only":
                this.elem["readOnly"] = value;
                break;
        }
    };
    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() { };

    Cnds.prototype.OnTextChanged = function () {
        return true;
    };

    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() { };

    Acts.prototype.SetText = function (text) {
        editor.setValue(text);
    };

    Acts.prototype.SetTooltip = function (text) {
        if (this.runtime.isDomFree)
            return;

        this.elem.title = text;
    };

    Acts.prototype.SetVisible = function (vis) {
        if (this.runtime.isDomFree)
            return;

        this.visible = (vis !== 0);
    };

    Acts.prototype.SetEnabled = function (en) {
        if (this.runtime.isDomFree)
            return;

        this.elem.disabled = (en === 0);
    };

    Acts.prototype.SetReadOnly = function (ro) {
        if (ro == 0) {
            editor.setReadOnly(true);  // false to make it editable
        } else {
            editor.setReadOnly(false);  // false to make it editable
        };
    };

    Acts.prototype.SetFocus = function () {
        if (this.runtime.isDomFree)
            return;

        this.elem.focus();
    };

    Acts.prototype.SetBlur = function () {
        if (this.runtime.isDomFree)
            return;

        this.elem.blur();
    };

    /*Acts.prototype.SetCSSStyle = function (p, v) {
        if (this.runtime.isDomFree)
            return;

        jQuery(this.elem).css(p, v);
    };*/

    Acts.prototype.ScrollToBottom = function () {
        if (this.runtime.isDomFree)
            return;

        this.elem.scrollTop = this.elem.scrollHeight;
    };

    //Armaldio Actions

    Acts.prototype.SetEditorTheme = function (choice) {
        if (choice == 0) {
            editor.setTheme('ace/theme/monokai');
        } else if (choice == 1) {
            editor.setTheme('ace/theme/chaos');
        } else if (choice == 2) {
            editor.setTheme('ace/theme/terminal');
        }
    };

    Acts.prototype.SetEditorLang = function (choice) {
        if (choice == 0) {
            editor.getSession().setMode("ace/mode/javascript");
        } else if (choice == 1) {
            editor.getSession().setMode("ace/mode/c_cpp");
        } else if (choice == 2) {
            editor.getSession().setMode("ace/mode/csharp");
        } else if (choice == 3) {
            editor.getSession().setMode("ace/mode/batch");
        }
    };

    Acts.prototype.LoadEditor = function () {
        console.log("Load editor");
        editor = ace.edit('editor');

        editor.getSession().setMode('ace/mode/javascript');
        editor.setTheme('ace/theme/monokai');
        editor.setValue('var dummyVar = "this is a dummy text"; //Javascript\n\nstd::cout << "Hello, new world!"; //C++\n\nConsole.WriteLine("Hello World!"); //C#');
    };

    Acts.prototype.InsertAtCursor = function (text) {
        editor.insert(text);
    };

    Acts.prototype.GoToALine = function (line) {
        editor.gotoLine(line);
    };

    Acts.prototype.setFontSize = function (size) {
        editor.setFontSize(size);
        //document.getElementById('editor').style.fontSize = size + 'px';
    };




    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() { };

    Exps.prototype.Text = function (ret) {
        ret.set_string(editor.getValue());
    };

    Exps.prototype.SelectedText = function (ret) {
        ret.set_string(editor.session.getTextRange(editor.getSelectionRange()));
    };

    Exps.prototype.getCursor = function (ret, variable) {
        var obj = editor.selection.getCursor();
        ret.set_int(obj[variable]);
    };

    pluginProto.exps = new Exps();

}());