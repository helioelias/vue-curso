var app = new Vue({

    el: '#app', 

    data: {
       
        books: [],

        MySearch: '',

        orderCol: '',

        orderInverse: true,

        pagination: {
            maxPage: 4,
            current: 1,
            totalItems: 0,
            totalPages: 0,
            listPagination: []
        }

    },

    computed:{
        
        filterByMySearch: function(){

            var self = this;

            return _.orderBy(this.books.filter(function(item){
                
                return item.title.indexOf(self.MySearch) > -1 || 
                       item.description.indexOf(self.MySearch) > -1;
                

            }), self.orderCol, self.orderInverse ? 'asc' : 'desc');

        }
    },

    methods:{
       
        filterOrderBy: function(e, col){

            e.preventDefault();

            this.orderCol = col;

            this.orderInverse = !this.orderInverse;
            
        },

        previous: function(e){
            e.preventDefault();

            if(this.pagination.current === 1){
                return false;
            }

            this.pagination.current = this.pagination.current - 1;

            this.books = this.pagination.listPagination[this.pagination.current - 1];
        },

        next: function(e){
            e.preventDefault();

            if(this.pagination.current === this.pagination.totalPages){
                return false;
            }

            this.pagination.current = this.pagination.current + 1;

            this.books = this.pagination.listPagination[this.pagination.current - 1];
        },

        pagePagination: function(e, current){
            e.preventDefault();

            this.pagination.current = current + 1;
            this.books = this.pagination.listPagination[current];
        }

    },

    mounted: function (){
        var self = this;

        self.$http.get('/json/dataServer.json').then(function(response){
            
            var  books = response.body;
            self.pagination.totalItems = books.length;
            self.pagination.totalPages = Math.ceil(self.pagination.totalItems / self.pagination.maxPage);

            var aux = [];

            for(k in books){
                
                aux.push(books[k]);

                if(aux.length === self.pagination.maxPage){
                    self.pagination.listPagination.push(aux);
                    aux = [];
                }

            }

            if(aux.length > 0){
                self.pagination.listPagination.push(aux);
            }

            console.log(self.pagination);

            self.books = self.pagination.listPagination[0];

        });
    } 

});