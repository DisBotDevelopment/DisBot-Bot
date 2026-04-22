namespace Shared.Models.Http.Responses;

public record PagedData<T>(T[] Data, int TotalLength);