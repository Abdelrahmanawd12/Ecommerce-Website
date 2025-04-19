namespace Jumia_Api.DTOs.CustomerDTOs
{
    public class AwadWishListDTO
    {
        public int WishlistId { get; set; }
        public string CustomerName { get; set; }
        public virtual List<AwadWishListItemDTO> WishlistItems { get; set; }= new List<AwadWishListItemDTO>();
    }
}
