namespace Shared.Http.Responses;

public record PagedData<T>(T[] Data, int TotalLength);