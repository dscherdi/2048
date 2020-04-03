
<script>
    export let value = '';

 export function getValue() {
     return value;
 }
</script>

<style>
label {
    font-size: 40px;
    
}
div {
    display: flex;
    justify-content: center;
    align-items: center;
    border : 10px black solid;
    width: 100%;
    height:100%;
    box-sizing: border-box;
}

</style>

<div ><label>{value}</label></div>