


$(function() {
	
	var Task = Backbone.Model.extend({ 

		initialize: function() {
			if (!this.get('timeText')) {		
				this.updateTime();
			}
			if (!this.get('complete')) {
				this.set({'complete' : 'no'})
			}
		},
		
		updateTime: function() {
			this.set({'timeText' : formatTimeText(new Date())},{silent:true});
		},
		
		flip: function() {  
			this.updateTime();
			this.set({'complete' : (this.get('complete') === 'yes' ? 'no' : 'yes')},{silent:true});
			this.save({wait:true});
		}
		
	});
	
	var Tasks = Backbone.Collection.extend({
		
		model: Task,
		
		localStorage: new Store('mvc')
		
	});
	
	var tasks = new Tasks();
	
	var TaskView = Backbone.View.extend({
		
		tagName:'div',
		className:'task',
		
		events: {
			'click .task-checkbox' : 'flipCompleted'
		},
		
		// Backbone docs:
		// Binding "this" 
		// Perhaps the single most common JavaScript "gotcha" 
		// is the fact that when you pass a function as a callback, 
		// its value for this is lost. 
		// With Backbone, when dealing with events and callbacks, 
		// you'll often find it useful to rely on _.bind and _.bindAll from Underscore.js.
		
		initialize: function() {
			_.bindAll(this,'render','flipCompleted');
			this.template = _.template($('#task-template').html());
			this.model.on('change',this.render);
		},
		
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},
		
		flipCompleted: function() {
			this.model.flip(); 
		}
		
	});
	
	var AppView = Backbone.View.extend({
		
		el: $('#tasks'),
		
		initialize: function() {
			_.bindAll(this,'add','addAll');
			
			tasks.on('add', this.add);
			tasks.on('reset', this.addAll);
			tasks.fetch();
		},
		
		add: function(task) {
			var view = new TaskView({model:task})
			$(this.el).append(view.render().el);
		},
		
		addAll: function() {
			tasks.each(this.add);
		}
		
	});
	
	var appView = new AppView();	 
	
	$('input[type=submit]').click(function() { 
		var d =  $('#new-task').val();		
		
		// not working, see https://github.com/documentcloud/backbone/pull/593#issuecomment-4041716
		// tasks.create({description:d},{wait: true});
		
		var t = new Task({description:d});
		t.collection = tasks;
		t.save({wait: true});
		tasks.add(t);

		$('#new-task').val('');
		$('#new-task').focus();
		return false;
	}); 
	
});