$(document).ready(function(){
    $.getJSON("/product/fetch_all_category",
    function(responce){
        responce.data.map((item)=>{
                
            $('#categoryid').append($('<option>').text(item.categoryname).val(item.categoryid))
        })
    })
    $('#categoryid').change(function(){

        $.getJSON("/product/fetch_all_type",{categoryid:$('#categoryid').val()},
        function(responce){
            $('#producttypeid').empty()
            $('#producttypeid').append($('<option>').text('-Select Type-'))
            responce.data.map((item)=>{
                   
                $('#producttypeid').append($('<option>').text(item.producttype).val(item.producttypeid))
            })
        })  
    })
})