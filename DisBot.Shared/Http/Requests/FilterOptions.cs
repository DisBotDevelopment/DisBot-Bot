using System.Diagnostics.CodeAnalysis;

namespace Shared.Http.Requests;

public class FilterOptions : IParsable<FilterOptions>
{
    public Dictionary<string, string> Filters { get; set; }

    public FilterOptions()
    {
        Filters = new();
    }

    public FilterOptions(Dictionary<string, string> filters)
    {
        Filters = filters;
    }

    public static FilterOptions Parse(string s, IFormatProvider? provider)
    {
        if (!TryParse(s, provider, out var result))
            throw new AggregateException("Unable to parse filter options");

        return result;
    }

    public static bool TryParse(
        [NotNullWhen(true)] string? input,
        IFormatProvider? provider,
        [MaybeNullWhen(false)] out FilterOptions result
    )
    {
        result = new();

        if (string.IsNullOrEmpty(input))
            return true;

        var filters = input.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        foreach (var part in filters)
        {
            var filterParts = part.Split('$', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            if (filterParts.Length != 2)
                continue;

            result.Filters.Add(filterParts[0], filterParts[1]);
        }

        return true;
    }

    public override string ToString()
    {
        var result = "";

        foreach (var filter in Filters)
            result += $"{filter.Key}${filter.Value};";

        return result;
    }
}