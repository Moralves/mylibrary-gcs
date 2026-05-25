package br.com.senai.mylibrary.book;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query(
        """
        select b from Book b
        join fetch b.category c
        where (:categoryId is null or c.id = :categoryId)
          and (:status is null or b.status = :status)
          and (
            :search is null
            or lower(b.title) like lower(concat('%', :search, '%'))
            or lower(b.author) like lower(concat('%', :search, '%'))
          )
        order by b.title asc
        """
    )
    List<Book> findAllByFilters(
        @Param("categoryId") Long categoryId,
        @Param("status") BookStatus status,
        @Param("search") String search
    );

    @Query(
        """
        select b from Book b
        join fetch b.category
        where b.id = :id
        """
    )
    Optional<Book> findByIdWithCategory(@Param("id") Long id);

    boolean existsByCategoryId(Long categoryId);

    long countByCategoryId(Long categoryId);
}
